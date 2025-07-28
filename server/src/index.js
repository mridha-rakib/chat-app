import http from "http";
import app from "#app/app";
import env from "#app/env";
import { connectDB } from "#app/config/database.config";
import { logger } from "#app/middlewares/pino-logger";
import { initializeSocket } from "#app/socket/socket";

(async () => {
  await connectDB();

  const server = http.createServer(app);
  initializeSocket(server);

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });

  app.on("error", (error) => {
    logger.error(`❌ Server error: ${error}`);
  });

  process.on("unhandledRejection", (error) => {
    logger.error(`❌ Unhandled rejection: ${error}`);
  });

  process.on("uncaughtException", (error) => {
    logger.error(`❌ Uncaught exception: ${error}`);
  });

  process.on("exit", () => {
    logger.warn("👋 Bye bye!");
  });

  process.on("SIGINT", () => {
    logger.warn("👋 Bye bye!");
  });
})();
