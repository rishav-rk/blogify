import { ERROR_MESSAGES, STATUS_CODES } from "../config/appConstants.js";

class ValidationError extends Error {
  data: unknown;
  logError: boolean;
  statusCode: number;

  constructor(
    statusCode = STATUS_CODES.VALIDATION_FAILED,
    message = ERROR_MESSAGES.VALIDATION_FAILED,
    data: unknown | null,
    logError = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = this.constructor.name;
    this.message = message;
    this.data = data;
    this.logError = logError;
    this.statusCode = statusCode;
  }
}

class OperationalError extends Error {
  data: unknown;
  logError: boolean;
  statusCode: number;

  constructor(
    statusCode = STATUS_CODES.ACTION_FAILED,
    message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    data: unknown | null = null,
    logError = true,
  ) {
    super(message);

    Object.setPrototypeOf(this, OperationalError.prototype);
    this.name = this.constructor.name;
    this.data = data;
    this.statusCode = statusCode;
    this.logError = logError;
  }
}

class NotFoundError extends Error {
  statusCode: number;
  logError: boolean;

  constructor(
    statusCode = STATUS_CODES.NOT_FOUND,
    message = ERROR_MESSAGES.NOT_FOUND,
    logError = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name
    this.logError = logError;
  }
}

class AuthFailedError extends Error {
  statusCode: number;
  logError: boolean;

  constructor(
    statusCode = STATUS_CODES.UNAUTHORIZED,
    message = ERROR_MESSAGES.UNAUTHORIZED,
  ) {
    super(message);

    Object.setPrototypeOf(this, AuthFailedError.prototype);

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.logError = statusCode === STATUS_CODES.FORBIDDEN;
  }
}

export { ValidationError, OperationalError, NotFoundError, AuthFailedError };
