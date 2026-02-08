import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

export let mqttClient;

export const connectMQTT = () => {
  const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    keepalive: 60,
    reconnectPeriod: 1000, 
  };

  mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, options);

  mqttClient.on('connect', () => {
    console.log('System: Connected to MQTT Broker');
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT Connection Error:', err);
  });

  mqttClient.on('reconnect', () => {
    console.log('MQTT Reconnecting...');
  });
};

export const publishMQTT = (topic, message) => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, JSON.stringify(message), (err) => {
      if (err) console.error(`Publish Error to ${topic}:`, err);
      else console.log(`Command sent to ${topic}`);
    });
  } else {
    console.error('Cannot publish: MQTT client not connected');
  }
};

