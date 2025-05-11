import CustomPackage from "../model/customPackageModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import { createTransport } from "nodemailer";
import User from "../model/userModel.js";

const addcustomizePackage = asyncErrorHandler(async (req, res, next) => {
  const {
    user,
    vehicleType,
    vehicleCondition,
    distance,
    duration,
    vehicle,
    driver,
  } = req.body;
  const addcustom = await CustomPackage.create({
    user,
    vehicleType,
    vehicleCondition,
    distance,
    duration,
    vehicle,
    driver,
  });

  const transporter = createTransport({
    host: "smtp.ethereal.email", // Correct host for Gmail
    port: 587, // Common port for STARTTLS
    secure: false,
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const customer = await User.findById(user);
  // Email message options
  const mailOptions = {
    from: process.env.USER, // sender address
    to: customer.email, // list of receivers
    subject: "customize package", // Subject line
    text: `Hi ${customer.name}, your customize package has been successfully placed.!`, // plain text body
   
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  if(info){

      res.status(201).send({ message: "Add successful", addcustom: addcustom._id });
  }
});

const allCustomPack = asyncErrorHandler(async (req, res, next) => {
  const customPackage = await CustomPackage.find()
    .populate("user")
    .select("-password")
    .populate("vehicle")
    .populate("driver")
    .select("-password");
  res.status(200).send(customPackage);
});

const updatepackStatus=asyncErrorHandler(async(req,res,next)=>{
  const driverStatus = await CustomPackage.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    { new: true }
  );
  res.json({ message: "ok" });
});

export { addcustomizePackage, allCustomPack,updatepackStatus };
