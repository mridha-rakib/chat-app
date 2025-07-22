import { Router } from "express";
import auth_router from "#app/routes/auth.route";

const rootRouter = Router();

const moduleRoutes = [{ path: "/auth", route: auth_router }];

moduleRoutes.forEach(({ path, route }) => {
  rootRouter.use(path, route);
});

export default rootRouter;
