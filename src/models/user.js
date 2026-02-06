import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: {
    state: { type: String, default: 'Enugu' },
    city: String,
    street: String
  },
  meters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meter' }] 
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
export default User;
