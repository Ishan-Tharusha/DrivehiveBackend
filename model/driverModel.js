import mongoose from "mongoose";


const driverSchema = new mongoose.Schema({
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
    lic:{
        type: String,
        required: [true, "please enter your license No"], 
    },
    address:{
      type: String,
      required: [true, "please enter adress"], 
  },
    password: {
      type: String,
      required: [true, "please enter password"],
      minlength: 8,
      // select:false
    },
    isActive: {
      type: Boolean,
      default: true,
      // select:false
    },
    isAvailabe:{
      type:Boolean,
      default:true
    },
    role: {
      type: String,
      default: "driver",
    },
  });
  
  const Drive = mongoose.model("driver", driverSchema);
  export default Drive;
  