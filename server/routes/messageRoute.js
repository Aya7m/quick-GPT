import { Router } from "express";

const messageRoute=Router();
import { ProtectRoute } from "../middleware/Auth.js";
import { imageMessageController, textMessageController } from "../controller/messageController.js";

messageRoute.post('/text',ProtectRoute,textMessageController)
messageRoute.post('/image',ProtectRoute,imageMessageController)

export default messageRoute;