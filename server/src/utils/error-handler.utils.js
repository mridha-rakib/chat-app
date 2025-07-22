import { HTTPSTATUS } from "#app/config/http.config";
import { ErrorCodeEnum } from "#app/enums/error-code.enum";

export class AppError extends Error {
  constructor(message, statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends AppError {
  constructor(message = "Http Exception Error", statusCode, errorCode) {
    super(message, statusCode, errorCode);
  }
}

export class InternalServerException extends AppError {
  constructor(message = "Internal Server Error", errorCode) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource not found", errorCode) {
    super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND);
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCodeEnum.VALIDATION_ERROR);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", errorCode) {
    super(message, HTTPSTATUS.CONFLICT, errorCode || ErrorCodeEnum.CONFLICT_ERROR);
  }
}
