import mqtt from 'mqtt';
import Usage from '../models/usage.js';
import Meter from '../models/Meter.js';

export let mqttClient;

const TARIFF_RATES = { 'A': 225.0, 'B': 68.0, 'C': 52.0 };

export const initMQTT = () => {
  mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);

  mqttClient.on('connect', () => {
    console.log('📡 Connected to LUMINEST MQTT Broker');
    mqttClient.subscribe('luminest/meters/+/telemetry', (err) => {
      if (!err) console.log('Subscribed to Meter Telemetry');
    });
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      const serialNumber = topic.split('/')[2];

      const meter = await Meter.findOne({ serialNumber });
      if (!meter) return console.log(`Unknown Meter: ${serialNumber}`);

      const usageKwh = payload.kwh || 0;
      const rate = TARIFF_RATES[meter.tariffBand] || TARIFF_RATES['A'];
      const cost = usageKwh * rate;

      meter.walletBalance -= cost;
      if (meter.walletBalance <= 0) {
        meter.walletBalance = 0;
        meter.isActive = false;

        mqttClient.publish(`luminest/meters/${serialNumber}/control`, JSON.stringify({
          command: "DISCONNECT",
          reason: "Low Balance"
        }));
        console.log(`🔌 Power cut for Meter: ${serialNumber} (Insufficient Funds)`);
      }

      await Usage.create({
        meterId: meter._id,
        timestamp: new Date(),
        voltage: payload.v,
        current: payload.a,
        powerWatts: payload.v * payload.a,
        cumulativeKwh: usageKwh
      });

      meter.lastPulse = new Date();
      await meter.save();

      console.log(`Meter ${serialNumber}: -₦${cost.toFixed(2)} | Balance: ₦${meter.walletBalance.toFixed(2)}`);
      
    } catch (error) {
      console.error('MQTT Processing Error:', error.message);
    }
  });
};