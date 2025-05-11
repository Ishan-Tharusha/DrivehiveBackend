import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customerError.js";
import Package from "../model/packageModel.js";

const addPackage = asyncErrorHandler(async (req, res, next) => {
  const {
    vehicleType,
    packagename,
    Personcount,
    distance,
    duration,
    driver,
    price,

    condition,
  } = req.body;
  const addpack = await Package.create({
    vehicleType,
    packagename,
    Personcount,
    distance,
    duration,
    driver,
    price,
    condition,
  });
  res.status(201).send({message:"Add successful"});
});

const getpackage = asyncErrorHandler(async (req, res, next) => {
  const allPack = await Package.find({});
  res.status(200).json(allPack);
});

const packDelete=asyncErrorHandler(async(req,res,next)=>{
  const packStatus = await Package.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    { new: true }
  );
  res.json({ message: "ok", packStatus});
});
const getpackById=asyncErrorHandler(async(req,res,next)=>{
  const pack=await Package.findById(req.params.id);
  res.status(200).send(pack);
})

const editpack=asyncErrorHandler(async(req,res,next)=>{
  const packedit=await Package.findByIdAndUpdate(req.params.id,req.body,{new:true}); 
  res.status(200).send({message:"success update"});
})


export { addPackage,getpackage,packDelete,editpack,getpackById};
