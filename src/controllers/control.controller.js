import Meter from '../models/Meter.js';
import { publishMQTT } from '../config/mqtt.js';

export const togglePower = async (req, res) => {
  const { meterId, action } = req.body; 

  try {
    const meter = await Meter.findOne({ _id: meterId, owner: req.user._id });

    if (!meter) {
      return res.status(404).json({ message: 'Meter not found or unauthorized' });
    }

    if (action === 'ACTIVATE' && meter.walletBalance <= 0) {
      return res.status(400).json({ message: 'Insufficient balance to activate power' });
    }

    const topic = `luminest/meters/${meter.serialNumber}/control`;
    const message = {
      command: action,
      timestamp: new Date(),
      requestedBy: 'user_app'
    };

    publishMQTT(topic, message);
    
    meter.isActive = (action === 'ACTIVATE');
    await meter.save();

    res.json({ 
      message: `Power ${action === 'ACTIVATE' ? 'restored' : 'disconnected'} successfully`,
      status: meter.isActive 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};