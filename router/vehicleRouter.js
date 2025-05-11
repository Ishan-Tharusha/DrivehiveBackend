import { Router } from "express";
import { addExpense, addVehicle, gellAllExpenses, gellAllVehicle, oneVehicle, vehicleDelete, vehilcleUpdate } from "../controller/vehicleContoller.js";
import multer from 'multer'
const router = Router();
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this directory exists or is created
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Modify the route to include multer middleware
router.route("/addvehicle").post(upload.single('image'), addVehicle);
router.route("/allvehicle").get(gellAllVehicle);
router.route("/onevehicle/:id").get(oneVehicle);
router.route('/vehicleupdate/:id').patch(upload.single('image'), vehilcleUpdate);
router.route("/deletevehicle/:id").patch(vehicleDelete);
router.route ("/expense").post(addExpense);
router.route ("/allDetails").get(gellAllExpenses);






export default router;