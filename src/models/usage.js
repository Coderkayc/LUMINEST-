import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  meterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter', required: true },
  timestamp: { type: Date, required: true },
  voltage: Number,
  current: Number,
  powerWatts: Number,
  cumulativeKwh: Number
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'meterId',
    granularity: 'minutes'
  }
});

const Usage = mongoose.model('Usage', usageSchema);
export default Usage;