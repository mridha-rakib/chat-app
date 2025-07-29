import { Server } from "socket.io";
import env from "#app/env";
import { BadRequestException } from "#app/utils/error-handler.utils";
import { logger } from "#app/middlewares/pino-logger";

let io;
const userSocketMap = {};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      logger.warn("user disconnected", socket.id);
      if (userId && userId !== "undefined") {
        delete userSocketMap[userId];
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("error", (error) => {
      logger.error("Socket error:", error);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new BadRequestException("Socket.io not initialized");
  return io;
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
