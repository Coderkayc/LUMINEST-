import crypto from 'crypto';
import Meter from '../models/Meter.js';

export const initializePayment = async (req, res) => {
  const { amount, meterId } = req.body;
  
  res.json({ message: "Payment initialization logic goes here" });
};

export const handleWebhook = async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                       .update(JSON.stringify(req.body))
                       .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid Signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { amount, metadata } = event.data;
      const meterId = metadata.meter_id; 

      const nairaAmount = amount / 100;
      
      const meter = await Meter.findById(meterId);
      if (meter) {
        meter.walletBalance += nairaAmount;
      
        if (meter.walletBalance > 0 && !meter.isActive) {
          meter.isActive = true;
        }
        
        await meter.save();
        console.log(`✅ Success: ₦${nairaAmount} added to Meter ${meter.serialNumber}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
};