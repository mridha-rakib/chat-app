import { ErrorCodeEnum } from "#app/enums/error-code.enum";
import { logger } from "#app/middlewares/pino-logger";
import {  ZodError } from "zod";
import { BadRequestException } from "#app/utils/error-handler.utils";

export const zParse = async (schema, req) => {
  try {
    logger.info("Validation input:", {
      body: req.body,
      params: req.params,
      query: req.query,
      url: req.url,
      method: req.method,
    });

    const result = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
      headers: req.headers,
    });

    logger.info("Validation successful");
    return result;
  } catch (error) {
    logger.error("Validation error details:", {
      error: error.message,
      issues: error instanceof ZodError ? error.issues : null,
      requestData: {
        body: req.body,
        params: req.params,
        query: req.query,
        url: req.url,
      },
    });
    if (error instanceof ZodError) {
      throw error;
    }
    throw new BadRequestException("Validation failed", ErrorCodeEnum.VALIDATION_ERROR);
  }
};
