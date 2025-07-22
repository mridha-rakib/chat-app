import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import httpStatus from "http-status";
import { pinoLogger } from "#app/middlewares/pino-logger";
import env from "#app/env";
import rootRouter from "#app/routes/index.route";
import { errorHandler } from "#app/middlewares/error-handler.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoLogger());
app.use(
  cors({
    origin: env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(env.BASE_PATH, rootRouter);

app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

app.use(errorHandler);

export default app;
