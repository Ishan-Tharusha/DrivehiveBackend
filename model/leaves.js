import mongoose from "mongoose";

const leaveSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    title:{
        type:String
    },
    message:{
        type:String
    },
    date:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    approve:{
        type:Boolean,
        default:false
    }

})

const Leave=mongoose.model("leave",leaveSchema)
export default Leave;