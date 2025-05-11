import { Router } from "express";
import { addPackage, editpack, getpackById, getpackage, packDelete } from "../controller/packageController.js";



const router = Router();
router.route("/addpackage").post(addPackage);
router.route("/getpackage").get(getpackage);
router.route("/deletePack/:id").patch(packDelete);
router.route("/editpack/:id").patch(editpack);
router.route("/onegetpack/:id").get(getpackById);

 



export default router;