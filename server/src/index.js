import app from "#app/app";
import env from "#app/env";
import { connectDB } from "#app/config/database.config";
import { logger } from "#app/middlewares/pino-logger";

(async () => {
  await connectDB();
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
