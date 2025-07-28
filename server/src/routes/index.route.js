import { Router } from "express";
import auth_router from "#app/routes/auth.route";
import message_router from "#app/routes/message.route";
import path from "path";

const rootRouter = Router();

const moduleRoutes = [
  { path: "/auth", route: auth_router },
  {
    path: "/messages",
    route: message_router,
  },
];

moduleRoutes.forEach(({ path, route }) => {
  rootRouter.use(path, route);
});

export default rootRouter;
