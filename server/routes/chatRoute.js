import { Router } from "express";
import { ProtectRoute } from "../middleware/Auth.js";
import { createChat, deleteChat, getAllChats } from "../controller/chatController.js";

const chatRoute=Router();
chatRoute.post('/create',ProtectRoute,createChat)
chatRoute.get('/all',ProtectRoute,getAllChats)
chatRoute.delete('/delete',ProtectRoute,deleteChat)

export default chatRoute;