import { Router } from "express";
import { addcustomizePackage, allCustomPack, updatepackStatus} from "../controller/customPackageController.js";

const router = Router();
router.route("/addcustompackage").post(addcustomizePackage);
router.route("/getallcustompackage").get(allCustomPack);
router.route("/detelecustompack/:id").put(updatepackStatus);






export default router;
