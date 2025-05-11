import mongoose from "mongoose";

const payementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  packageName: {
    type: mongoose.Schema.ObjectId,
    ref: "package",
  },
  customisePackage: {
    type: mongoose.Schema.ObjectId,
    ref: "CustomPackage",
  },

  payementType: {
    type: String,
    default: "card",
  },
  packageType: {
    type: String,
  },
  billDetails: [
    {
      address: {
        type: String,
        required: [true, "enter your address"],
      },
      town: {
        type: String,
        required: [true, "enter the town"],
      },
    },
  ],
  cardDetails: [
    {
      cardNumber: {
        type: String,
      },
      expireMonth: {
        type: String,
      },
      expireDate: {
        type: String,
      },
      cvv: {
        type: Number,
      },
    },
  ],
  total: {
    type: String,
    required: true,
  },
  date:{
    type:Date,
    default: Date.now
    
  }
});

const Payement = mongoose.model("payement", payementSchema);
export default Payement;
