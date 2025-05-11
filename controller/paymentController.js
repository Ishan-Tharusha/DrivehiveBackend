import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import Payment from "../model/paymentModle.js";
import User from "../model/userModel.js";
import { createTransport } from "nodemailer";

// Create a transporter object using the default SMTP transport

  
  const addPayment = asyncErrorHandler(async (req, res, next) => {
      const {
          user,
          packageName,
          billDetails,
          cardDetails,
          packageType,
          customisePackage,
          total,
      } = req.body;
  
      try {
          const addpay = await Payment.create({
              user,
              packageName,
              billDetails,
              customisePackage,
              packageType,
              cardDetails,
              total,
          });
          const transporter = createTransport({
            host: 'smtp.ethereal.email', // Correct host for Gmail
            port: 587, // Common port for STARTTLS
            secure: false,
            service:'gmail',
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
          });
  
          // Fetch the user's email from the user model using the ID provided in the payment details
          const customer = await User.findById(user); // Assuming 'User' is your user model
  
          // Email message options
          const mailOptions = {
              from: process.env.USER, // sender address
              to: customer.email, // list of receivers
              subject: 'Order Confirmation', // Subject line
              text: `Hi ${customer.name}, your order has been successfully placed.\nTotal: ${total}\nThank you for your purchase!`, // plain text body
              html: `<p>Hi ${customer.name},</p><p>Your order  been successfully placed.</p><p>Total: ${total}</p><p>Thank you for your purchase!</p>`, // html body
          };
  
          // Send the email
          const info = await transporter.sendMail(mailOptions);
     
  
          res.status(201).send({ message: "Add successful" });
      } catch (error) {
          console.error('Payment processing or email sending failed', error);
          res.status(500).send({ message: 'Payment processing failed' });
      }
  });
  
const getAllPayments = asyncErrorHandler(async (req, res, next) => {
    const payments = await Payment.find({})
        .populate("user")
        .populate("packageName");
    res.status(200).send(payments);
});

const getPaymentById = asyncErrorHandler(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate("packageName");
    if (!payment) {
        return next(new CustomError("No payment found", 404));
    }
    res.status(200).send(payment);
})



export { addPayment,getAllPayments,getPaymentById };