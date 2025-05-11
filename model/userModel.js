import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
  },
  phoneNo: {
    type: Number,
    required: [true, "please enter your number"],
  },
  license:{
    type:String
  },
  address:{
    type:String
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: 8,
    // select:false
  },
  verified: { type: Boolean, default: true },
  isActive: {
    type: Boolean,
    default: true,
    // select:false
  },
  role: {
    type: String,
    
  },
});

const User = mongoose.model("user", userSchema);
export default User;
