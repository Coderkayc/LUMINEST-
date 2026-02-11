import Meter from '../models/Meter.js';
import User from '../models/User.js';

export const linkMeter = async (req, res) => {
  const { serialNumber } = req.body;

  try {
    const meter = await Meter.findOne({ serialNumber });

    if (!meter) {
      return res.status(404).json({ message: 'Meter not found. Please check the serial number.' });
    }

    if (meter.owner) {
      return res.status(400).json({ message: 'This meter is already linked to an account.' });
    }

    meter.owner = req.user._id;
    await meter.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { meters: meter._id }
    });

    res.json({ message: 'Meter linked successfully', meter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeterStats = async (req, res) => {
  try {
    const meter = await Meter.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });

    if (!meter) 
      return res.status(404).json({ message: 'Meter not found' });

    res.status(200).json({
      serialNumber: meter.serialNumber,
      walletBalance: meter.walletBalance,
      isActive: meter.isActive,
      tariffBand: meter.tariffBand,
      lastPulse: meter.lastPulse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyUsage = async (req, res) => {
  const { meterId } = req.params;

  try {
    const dailyStats = await Usage.aggregate([
      {
        $match: { meterId: new mongoose.Types.ObjectId(meterId) }
      },
      {
        $group: {
          _id: {
            $dateTrunc: { date: "$timestamp", unit: "day" }
          },
          totalKwh: { $sum: "$cumulativeKwh" },
          avgVoltage: { $avg: "$voltage" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUserMeters = async (req, res) => {
  try {

    const meters = await Meter.find({ owner: req.user._id });

    res.status(200).json({
      count: meters.length,
      meters: meters.map(meter => ({
        id: meter._id,
        serialNumber: meter.serialNumber,
        walletBalance: meter.walletBalance,
        isActive: meter.isActive,
        tariffBand: meter.tariffBand
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};