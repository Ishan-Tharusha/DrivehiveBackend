import { Router } from "express";
import { addPayment, getAllPayments, getPaymentById } from "../controller/paymentController.js";
const router = Router();
router.route("/addpayment").post(addPayment);
router.route("/gellAll").get(getAllPayments);
router.route("/getpayemnt/:id").get(getPaymentById);   

export default router;
