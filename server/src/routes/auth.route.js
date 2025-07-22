import { UserController } from "#app/controllers/auth.controller";
import { protectRoute } from "#app/middlewares/auth.middleware";
import { Router } from "express";

const auth_router = Router();

auth_router.post("/signup", UserController.signup);
auth_router.post("/login", UserController.login);
auth_router.get("/refresh", UserController.refresh);
auth_router.get("/profile", protectRoute, UserController.getProfile);
auth_router.post("/logout", protectRoute, UserController.logout);

export default auth_router;
