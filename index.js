import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./controller/errorController.js";
import userRouter from "./router/userRouter.js";
import vehicleRouter from "./router/vehicleRouter.js";
import driverRouter from "./router/driveRoute.js";
import empRouter from "./router/Emproute.js";
import packageRouter from "./router/packageRouter.js";
import paymentRouter from "./router/payementRoute.js";
import customizeRouter from "./router/custompackageRouter.js";
import feedbackRouter from "./router/feedback.js";
import salaryRoutes from './router/salaryRoutes.js';
import cors from "cors";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [process.env.BASE_URL],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/user", userRouter);

app.use("/vehicle", vehicleRouter);
app.use("/emp", empRouter);

app.use("/driver", driverRouter);

app.use("/package", packageRouter);
app.use("/payment", paymentRouter);
app.use("/customizepack", customizeRouter);
app.use("/feedback", feedbackRouter);
app.use('/api/salaries', salaryRoutes);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

// globale error handling middleware
app.use(globalErrorHandler);

mongoose
  .connect(process.env.CONNECT_STR)
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running ${port}`);
});
