import { Request, Response } from "express";
import { ERROR_MESSAGES, STATUS_CODES, SUCCESS_MESSAGES } from "../config/appConstants.js";
import { ValidationError, OperationalError, NotFoundError, AuthFailedError } from "./errors.js";
import logger from "../config/logger.js"; // Import your Winston instance

// --- SUCCESS RESPONSE UTILITY ---
export function successResponse(
  res: Response,
  statusCode: number = STATUS_CODES.SUCCESS,
  message: string = SUCCESS_MESSAGES.SUCCESS,
  data: any = {}
) {
  return res.status(statusCode).json({
    success: true, // Helpful boolean flag for frontend developers
    statusCode,
    message,
    data,
  });
}

// --- ERROR UTILITY INTERFACE ---
interface ErrorResponse extends Error {
  statusCode?: number;
  data?: any;
  response?: {
    status?: number;
  };
  code?: number;
  logError?: boolean;
}

// --- ERROR RESPONSE UTILITY ---
export function errorResponse(error: ErrorResponse, req: Request, res: Response) {
  // 1. Resolve HTTP Status Code safely
  let statusCode =
    error.response?.status ||
    error.statusCode ||
    error.code ||
    STATUS_CODES.INTERNAL_SERVER_ERROR;

  if (typeof statusCode !== "number") {
    statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  const logError = error.logError ?? true;
  const reqId = (req as any).reqId || "N/A"; // Extract request tracking ID if present

  // 2. Structured Logging with Winston
  if (logError) {
      // High-priority internal crash (database down, null pointers, etc.)
      logger.error(`[ReqID: ${reqId}] 💥 System Crash: ${error.message}`, {
        stack: error.stack,
        path: req.originalUrl,
        method: req.method,
      });
  }

  console.error(error.stack);

  // 3. Prevent Security Leaks on Critical 500 Failures
  if (statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR) {
    // TODO: Hook up your Slack/PagerDuty webhook notification right here for production alerts
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message: "Something went completely wrong on our end.",
    });
  }

  // 4. Resolve Clean Client Messages safely without [object Object] fallbacks
  const isCustomError =
    error instanceof NotFoundError ||
    error instanceof ValidationError ||
    error instanceof OperationalError ||
    error instanceof AuthFailedError;

  const message = isCustomError ? error.message : error.message || "An unexpected error occurred.";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    // name: error.name || "Error",
    message,
    ...(error.data && { data: error.data }), // Only inject data block if metadata keys exist
  });
}