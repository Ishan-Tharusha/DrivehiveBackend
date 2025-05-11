import mongoose from "mongoose";


const employeeSchema = new mongoose.Schema({
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
    role: {
      type: String,
      default: "emplyoee",
    },
  });
  
  const Employee = mongoose.model("employee", employeeSchema);
  export default Employee;
  