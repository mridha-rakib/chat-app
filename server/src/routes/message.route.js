import { Router } from "express";
import { MessageController } from "#app/controllers/message.controller";
import { protectRoute } from "#app/middlewares/auth.middleware";

const message_router = Router();

message_router.post("/send/:id", protectRoute, MessageController.sendMessage);
message_router.get("/:id", protectRoute, MessageController.getMessages);

export default message_router;
