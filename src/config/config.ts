import dotenv from "dotenv";
import { NODE_ENV } from "./appConstants.js";
import path from "path";
import { z } from "zod";
dotenv.config();

const envVarSchema = z.object({
  NODE_ENV: z.enum(Object.values(NODE_ENV)),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),
  JWT_SECRET: z.string().min(1, { message: "JWT_SECRET is required" }),
  JWT_EXPIRATION_DAYS: z.coerce.number().int().positive(),
});

const parsedEnv = envVarSchema.safeParse(process.env);
if (!parsedEnv.success) {
throw new Error(
  parsedEnv.error.issues
    .map((issue) => {
      const field = issue.path.join(".");

      if (issue.code === "invalid_type" && issue.input === undefined) {
        return `Cause: ${field} ---> ${field} is required`;
      }

      return `Cause: ${field} ---> ${issue.message}`;
    })
    .join("\n")
);
}
export default {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwt: {
    secret: parsedEnv.data.JWT_SECRET,
    expirationDays: parsedEnv.data.JWT_EXPIRATION_DAYS,
  },
};
