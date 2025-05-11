import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const UserLog = mongoose.model("UserLog", userLogSchema);

export default UserLog;
