import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Prisma } from "@prisma/client";
import { ERROR_MESSAGES, STATUS_CODES } from "../config/appConstants.js";
import { AuthFailedError } from "../utils/errors.js";
import { USER_TYPE as PrismaUserType } from "@prisma/client";

const verifyCallback =
  (req: Request, res: Response, next: NextFunction, allowedRoles: string[]) =>
  async (err: any, token: any, info: any) => {
    const isPublicRoute = allowedRoles.includes(PrismaUserType.none);

    if (err || info) {
      console.log(
        "Error message: ",
        err?.message,
        "\nInfo message : ",
        info?.message,
      );
      if (!token) {
        if (isPublicRoute) {
          req.token = { role: PrismaUserType.none };
          return next();
        }
        return next(new AuthFailedError());
      }
    }

    if (!allowedRoles.includes(token?.role)) {
      return next(
        new AuthFailedError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN),
      );
    }

    if (allowedRoles.includes(PrismaUserType.user)) {
      if (!token.user) {
        return next(new AuthFailedError());
      }
      if (token.user?.isDeleted) {
        return next(
          new AuthFailedError(
            STATUS_CODES.FORBIDDEN,
            ERROR_MESSAGES.ACCOUNT_DELETED,
          ),
        );
      } else if (!token.user?.isActive) {
        return next(
          new AuthFailedError(
            STATUS_CODES.FORBIDDEN,
            ERROR_MESSAGES.ACCOUNT_IN_REVIEW,
          ),
        );
      } else if (token.user?.isBlocked) {
        return next(
          new AuthFailedError(
            STATUS_CODES.FORBIDDEN,
            ERROR_MESSAGES.ACCOUNT_BLOCKED,
          ),
        );
      }
    }

    if (allowedRoles.includes(PrismaUserType.admin)) {
      console.log("Admin token:", token.admin);
      if (!token.user && !token.admin) {
        return next(new AuthFailedError());
      }
    }

    req.token = token;
    return next();
  };

const auth =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, res, next, allowedRoles),
    )(req, res, next);
  };

export default auth;
