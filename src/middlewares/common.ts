import { errorResponse } from "../utils/responses.js";
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../utils/errors.js"; // Path to your custom errors file

export const routeNotFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Uses your custom NotFoundError which automatically defaults to 404 status codes and messages
  return errorResponse(new NotFoundError(), req, res);
};

interface ErrorResponse {
  name: string;
  statusCode: number;
  message: string;
  data?: any;
  response?: {
    status?: number;
  };
  code?: number;
  logError?: boolean;
}

const errorhandler = (
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return errorResponse(error, req, res);
};

export { errorhandler };
