import { z } from "zod";
import { pick } from "../utils/universalFunctions.js";
import { ValidationError } from "../utils/errors.js"; // Standardized to match error.js path
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../config/appConstants.js";

type RequestSchema = {
  params?: z.ZodType;
  query?: z.ZodType;
  body?: z.ZodType;
};

const validate =
  (schema: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    // Manually build the object to avoid pick function issues with Express req
    const object: any = {};
    if (validSchema.params) object.params = req.params;
    if (validSchema.query) object.query = req.query;
    if (validSchema.body) object.body = req.body;
    // Parse each part of the request separately
    const errors: any[] = [];
    const validatedData: any = {};

    for (const key of Object.keys(validSchema)) {
      const schemaPart = validSchema[key];
      const dataPart = object[key];


      const result = schemaPart.safeParse(dataPart);
      if (!result.success) {
        errors.push(...result.error.issues);
      } else {
        validatedData[key] = result.data;
      }
    }

    if (errors.length > 0) {
      const errorMessages = errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      const combinedMessage = errorMessages.map((e) => e.message).join(", ");

      return next(
        new ValidationError(
          STATUS_CODES.VALIDATION_FAILED,
          combinedMessage,
          errorMessages,
        ),
      );
    }

    // Mutate req with the successfully validated and parsed data
    Object.keys(validatedData).forEach((key) => {
      if (key === 'body') {
        const target = req.body;
        if (target !== null && target !== undefined) {
          Object.assign(target, validatedData[key]);
        } else {
          req.body = validatedData[key];
        }
      } else if (key === 'params') {
        Object.assign(req.params, validatedData[key]);
      } else if (key === 'query') {
        Object.assign(req.query, validatedData[key]);
      }
    });
    return next();
  };

export { validate };
