import { z } from "zod";

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACTION_COMPLETE: 204,

  ACTION_FAILED: 400,
  VALIDATION_FAILED: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  INTERNAL_SERVER_ERROR: 500,
};

export const USER_TYPE = {
  USER: "user",
  ADMIN: "admin",
  NONE: "none"
}

export const TOKEN_TYPE = {
  ACCESS: "access",
  // REFRESH: "refresh",
  FORGOTPASSWORD: "forgotpassword",
}

export const SUCCESS_MESSAGES = {
  SUCCESS: "Success",
  CREATED: "Created",
  USER_REGISTERED: "Registration successful",
  USER_LOGGED_IN: "Log in successful",

  POST_CREATED: "Post created successfully",
};

export const NODE_ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
}

export const ERROR_MESSAGES = {
  ACTION_FAILED: "Action failed",

  ACCOUNT_NOT_FOUND: "Account doesn't exists",
  UNAUTHORIZED: "Please authenticate",
  FORBIDDEN: "Couldn't perform the action",
  USER_NOT_EXISTS: "User doesn't not exists",
  NOT_FOUND: "Not found",
  VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",

  POST_NOT_FOUND: "No post found", 
  POST_UNPUBLISHED_BY_ADMIN: "Post unpublished by admin, Contact Admin",
  OTHERS_POST: "Cannot perform this action on others' posts",

  // USER SPECIFIC
  ACCOUNT_ALREADY_EXISTS: "Account already exists",
  ACCOUNT_ALREADY_VERIFIED: "Account already verified",
  ACCOUNT_NOT_VERIFIED: "Account not verified yet",
  // USER_BLOCKED: "You are blocked", 
  ACCOUNT_BLOCKED: "Account blocked by admin",
  ACCOUNT_DELETED: "Account deleted",
  INCORRECT_PASSWORD: "Incorrect password",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

export const DEVICE_TYPES = {
  ANDROID: "android", 
  IOS : "ios", 
  WEB : "web"
}

export const ZOD = {
  EMAIL: z
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),
  NAME: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(
      /^[a-zA-Z\s-]+$/,
      "Name must contain only letters, spaces, or hyphens",
    ),
  PASSWORD: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
    DEVICE_ID: z.string(),
    DEVICE_TOKEN: z.string(),
    DEVICE_TYPE: z.enum(Object.values(DEVICE_TYPES)), 
    IMAGE: z.string().url({message: 'image url is required'}), 
    RECORD_ID: z.string().trim().min(1, "ID is required").regex(/^c[a-z0-9]{24}$/, "Please enter a valid ID")
};
