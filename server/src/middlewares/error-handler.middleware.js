import z, { ZodError } from "zod";
import { logger } from "./pino-logger.js";
import status from "http-status";
import { ErrorCodeEnum } from "#app/enums/error-code.enum";
import { AppError } from "#app/utils/error-handler.utils";

const formatZodError = (res, error) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(status.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler = (error, req, res, next) => {
  logger.error(`Error Occurred on PATH: ${req.path} `, error);

  if (error instanceof SyntaxError) {
    return res.status(status.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check your request body.",
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(status.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};
