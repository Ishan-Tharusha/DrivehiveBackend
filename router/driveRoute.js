import { Router } from "express";
import { acceptleave, addDriver, addLeave, deleteleavs, editDriver, getAllDriver, getDriverById, getLeaves, updateDriverStatus } from "../controller/driverController.js";
import { addAttendance, gellAllAttence } from "../controller/attendanceController.js";
const router = Router();
router.route("/addDriver").post(addDriver);
router.route("/alldriver").get(getAllDriver);
router.route("/updateDriver/:id").patch(updateDriverStatus)
router.route("/getDriver/:id").get(getDriverById)   
router.route("/editDriver/:id").patch(editDriver);

router.route("/addleave").post(addLeave);
router.route("/getAllleaves").get(getLeaves);
router.route("/accetleaves/:id").patch(acceptleave);
router.route("/deleteleavs/:id").patch(deleteleavs);

router.route("/attendance").post(addAttendance);

router.route("/allAttence").get(gellAllAttence);




export default router;
