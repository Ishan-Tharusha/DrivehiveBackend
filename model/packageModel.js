import mongoose from "mongoose";

const packageSchema=new mongoose.Schema({
    vehicleType:{
        type:String
    },
    packagename:{
        type:String
    },
    Personcount:{
        type:String
    },
    distance:{
        type:Number
    },
    duration:{
        type:Number
    },
    condition:{
        type:String
    },
    driver:{
        type:Boolean
    },
    price:{
        type:Number
    },
    isActive:{
        type:Boolean,
        default:true
    }

})

const Package=mongoose.model("package",packageSchema)
export default Package;