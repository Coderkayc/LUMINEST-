import mongoose from "mongoose";

const meterSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  walletBalance: { type: Number, default: 0 },
  tariffBand: { 
    type: String, 
    enum: ['A', 'B', 'C', 'D', 'E'], 
    default: 'A' 
  },
  isActive: { type: Boolean, default: true }, // For remote kill-switch
  lastPulse: { type: Date } // Last time the meter "called home"
}, { timestamps: true });

export const Meter = mongoose.model('Meter', meterSchema);