import {
  ERROR_MESSAGES,
  STATUS_CODES,
} from "../../config/appConstants.js";
import { USER_TYPE, DEVICE_TYPE } from "@prisma/client";
import prisma from "../../config/db.js";
import { comparePassword, hashPassword } from "../../utils/dbUtils.js";
import { OperationalError } from "../../utils/errors.js";
import { z } from "zod";
import {
  signUpValidator,
  loginValidator,
} from "../../validators/user/auth.validator.js";
import { generateAuthToken } from "../token.service.js";

type SinupInput = z.infer<typeof signUpValidator.body>;
type LoginInput = z.infer<typeof loginValidator.body>;

export const register = async (userData: SinupInput) => {
  if (
    await prisma.user.findFirst({
      where: { email: userData.email, isDeleted: false },
    })
  ) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS,
    );
  }

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: await hashPassword(userData.password),
    },
    select: { email: true, name: true },
  });
  return user;
};

export const login = async (userData: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: { email: userData.email, isDeleted: false },
    select: { id: true, name: true, password: true },
  });

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_NOT_FOUND,
    );
  }

  if (!(await comparePassword(userData.password, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.INCORRECT_PASSWORD,
    );
  }

  const token = await generateAuthToken(
    user.id,
    USER_TYPE.user,
    userData.deviceToken,
    userData.deviceType as DEVICE_TYPE,
    userData.deviceId,
    0,
    new Date(),
    true,
  );

  return token;
};
