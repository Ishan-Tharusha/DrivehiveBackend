import { Router } from "express";
import { acceptFeedback, addFeedback, deleteFeedback, getFeedback } from "../controller/feedbackController.js";
const router = Router();

router.route("/addfeedback").post(addFeedback);
router.route("/getfeedback").get(getFeedback);
router.route("/acceptfeedback/:id").put(acceptFeedback);
router.route("/deletefeedback/:id").put(deleteFeedback);

export default router;