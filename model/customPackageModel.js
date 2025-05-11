import mongoose from 'mongoose';

const customPackageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleCondition: {
    type: String,
    required: true
  },
 distance: {
    type: String,
    required: true
  },
 duration: {
    type: String,
    default: true
  },
 vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  isActive:{
    type:Boolean,
    default:true
  }
  
});

const CustomPackage = mongoose.model('CustomPackage', customPackageSchema);

export default CustomPackage;
