import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleName:{
        type:String,
        required: [true, "name is required"],
    },
    vehicleNo:{
        type:String,
        required: [true, "number is required"],
    },
    initialKM:{
        type:Number,
        required:[true,"km is requird"]
    },
    condition:{
        type:String,
        required:true
    },
   vehicletype:{
        type:String,
        required:true
   },
    seatCapacity:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    },
    rentStatus:{
        type:Boolean,
        required:true,
        default:false
    },
    image:{
        type:String
    }
    
})

const Vehicle=mongoose.model("vehicle",vehicleSchema);
export default Vehicle;