import crypto from 'crypto';
import Meter from '../models/Meter.js';

export const initializePayment = async (req, res) => {
  try {
    const { amount, meterId, serialNumber } = req.body;
    const userId = req.user.id; 

    const reference = `LUM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const paystackResponse = { 
      data: { authorization_url: "https://checkout.paystack.com/xyz", reference } 
    }; 

    const newTransaction = await Transaction.create({
      user: userId,
      meterId,
      serialNumber,
      amount,
      reference,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      data: paystackResponse.data.authorization_url
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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

export const getPaymentHistory = async (req, res) => {
  try {
    const { serialNumber } = req.body;
    const userId = req.user.id;

    let filter = { user: userId };
    if (serialNumber) {
      filter.serialNumber = serialNumber;
    }

    const history = await Transaction.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



