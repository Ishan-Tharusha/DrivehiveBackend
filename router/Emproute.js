import { Router } from "express";
import { addEmployee, allEmp, allLog, editEmp, oneEmployeeDetails, userLog } from "../controller/employeeController.js";

const router = Router();

router.route("/addemp").post(addEmployee);
router.route("/getAll").get(allEmp);
router.route("/editemp/:id").patch(editEmp);
router.route("/getemp/:id").get(oneEmployeeDetails);
router.route("/userlog").post(userLog);
router.route("/alllog").get(allLog);





export default router;
