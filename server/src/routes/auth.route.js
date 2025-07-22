import { UserController } from "#app/controllers/auth.controller";
import { Router } from "express";

const auth_router = Router();

auth_router.post("/signup", UserController.signup);
auth_router.post("/login", UserController.login);

export default auth_router;
