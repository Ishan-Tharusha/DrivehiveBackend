import vehicleExpense from "../model/Expenses.js";
import vehicle from "../model/vehicleModle.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";

const addVehicle = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      vehicleName,
      vehicleNo,
      initialKM,
      condition,
      vehicletype,
      seatCapacity,
    } = req.body;
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path;
    }

    const newVehicle = new vehicle({
      vehicleName,
      vehicleNo,
      initialKM,
      condition,
      vehicletype,
      seatCapacity,
      image: imagePath, // Assuming your model has an 'image' field
    });

    await newVehicle.save();

    return res.status(201).json({ message: "add vehicle", newVehicle });
  } catch (err) {
    const error = new CustomError(err, 404);
    return next(error);
  }
});

// all vehicle
const gellAllVehicle = asyncErrorHandler(async (req, res, next) => {
  const allvehicle = await vehicle.find({isActive:true});

  res.status(200).json(allvehicle);
});

// one vehicle

const oneVehicle = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const onevehicle = await vehicle.findById(id);
  if (!onevehicle) {
    const error = new CustomError("vehicle not available", 400);
    return next(error);
  }

  return res.status(200).send(onevehicle);
});

// update details vehicle
const vehilcleUpdate = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    vehicleName,
    vehicleNo,
    initialKM,
    condition,
    vehicletype,
    seatCapacity,
    image,
  } = req.body;
  const updatedVehicle = await vehicle.findByIdAndUpdate(
    id,
    {
      vehicleName,
      vehicleNo,
      initialKM,
      condition,
      vehicletype,
      seatCapacity,
      image,
    },
    { new: true }
  );
  res.status(200).json({message:"update success"});
});

const vehicleDelete=asyncErrorHandler(async(req,res,next)=>{
  const vehicleStatus = await vehicle.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    { new: true }
  );
  res.json({ message: "ok", vehicleStatus });
});

const addExpense=asyncErrorHandler(async(req,res,next)=>{
  const expense=await vehicleExpense.create(req.body);
  res.status(201).send({message:"successful create",expense})
})
// all vehicle
const gellAllExpenses = asyncErrorHandler(async (req, res, next) => {
  const allvehicle = await vehicleExpense.find({}).populate('vehicleID');

  res.status(200).json(allvehicle);
});

export { addVehicle, gellAllVehicle, oneVehicle,vehilcleUpdate,vehicleDelete ,addExpense,gellAllExpenses};
