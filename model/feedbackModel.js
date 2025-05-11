import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userfeed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  vehiclefeed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },
  driverfeed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
  isAtive: {
    type: Boolean,
    default: true,
  },  
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
