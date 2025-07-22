import jwt from "jsonwebtoken";
import { logger } from "#app/middlewares/pino-logger";
import { asyncHandler } from "#app/middlewares/async-handler.middleware";

export const protectRoute = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
});
