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
    const object = pick(req, Object.keys(validSchema));

    // Build the compound strict Zod object and parse
    const result = z.object(validSchema).strict().safeParse(object);

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const combinedMessage = errorMessages.map((e) => e.message).join(", ");

      // Conforms exactly to your Joi error handler instantiation signature
      return next(
        new ValidationError(
          STATUS_CODES.VALIDATION_FAILED,
          combinedMessage,
          errorMessages
        ),
      );
    }

    // Mutate req with the successfully validated and parsed data
    Object.assign(req, result.data);
    return next();
  };

export { validate };
