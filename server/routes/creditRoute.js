import { Router } from "express";

const creditRouter=Router();
import { ProtectRoute } from "../middleware/Auth.js";
import { getPlans, purchasePlan } from "../controller/creditController.js";

creditRouter.get('/plan',getPlans)
creditRouter.post('/purchase',ProtectRoute,purchasePlan)

export default creditRouter;