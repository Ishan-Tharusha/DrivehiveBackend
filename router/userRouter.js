import { Router } from "express";
import { editUser, forgot, getAllUser, getOrder, getUser, logOutUser, loginUser, registerUser, resetPass, updateuserStatus, verifyGmail } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/:id/verify/:token").get(verifyGmail);
router.route("/login").post(loginUser);
router.route("/alluser").get(getAllUser);
router.route("/edituser/:id").patch(editUser);
router.route("/logout").get(logOutUser);
router.route("/getuser").get(protect,getUser);
router.route("/userDelete/:id").patch(updateuserStatus);
router.route("/getOrder/:id").get(getOrder);
router.route('/forgotpass').post(forgot);
router.route('/resetPass').post(resetPass);







export default router;
