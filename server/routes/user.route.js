import { Router } from "express";
import { getPublishedImages, getUserProfile, loginUser, registUser } from "../controller/user.controller.js";
import { ProtectRoute } from "../middleware/Auth.js";

const userRouter=Router();

userRouter.post('/register',registUser)
userRouter.post('/login',loginUser)
userRouter.get('/me',ProtectRoute,getUserProfile)
userRouter.get('/publishedImages',getPublishedImages)

export default userRouter;