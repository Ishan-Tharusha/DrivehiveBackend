import mongoose from "mongoose";
const expenses = new mongoose.Schema({
    vehicleID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vehicle', // Reference to the Driver model
     
    },
    description: {
      type: String,
      
    },
    price:{
        type:Number
    }
    // You can add more fields like status, remarks, etc. if needed
  });

  const vehicleExpense = mongoose.model('vehicleExpense', expenses);

  export default vehicleExpense;