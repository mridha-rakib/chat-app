import jwt from "jsonwebtoken";
import { asyncHandler } from "#app/middlewares/async-handler.middleware";
import env from "#app/env";

export const protectRoute = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const msg = error.message;
    return res.status(401).json({
      success: false,
      message: `"Invalid or expired access token", ${msg}`,
    });
  }
});
