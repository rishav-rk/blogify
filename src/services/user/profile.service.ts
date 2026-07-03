import prisma from "../../config/db.js";
import { OperationalError } from "../../utils/errors.js";
import {
  changePasswordValidator,
  deleteAccountValidator,
  updateProfileValidator,
} from "../../validators/user/auth.validator.js";
import { ERROR_MESSAGES, STATUS_CODES } from "../../config/appConstants.js";
import z from "zod";
import { comparePassword } from "../../utils/dbUtils.js";
import bcrypt from "bcrypt"
export const updateProfile = async (
  userId: string,
  userData: z.infer<typeof updateProfileValidator.body>,
) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: userData.name,
      ...(userData.image !== undefined && { image: userData.image }),
    },
  });
};

export const changePassword = async (
  userId: string,
  passwordPayload: z.infer<typeof changePasswordValidator.body>,
) => {
  if (passwordPayload.currentPassword === passwordPayload.newPassword) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.PASSWORD_SAME_AS_OLD,
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user && !comparePassword(passwordPayload.currentPassword, user.password)) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.INCORRECT_CURRENT_PASSWORD,
    );
  }

  const hashedPassword = await bcrypt.hash(passwordPayload.newPassword, 10);
  
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const deleteAccount = async (userId: string, passwordData: z.infer<typeof deleteAccountValidator.body>) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user && !comparePassword(passwordData.password, user.password)) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.INCORRECT_PASSWORD,
    );
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const logout = async (tokenId: string) => {
  await prisma.token.update({
    where: {
      id: tokenId,
    },
    data: {
      isDeleted: true,
    },
  });
};
