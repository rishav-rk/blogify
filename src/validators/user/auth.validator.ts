import { z } from "zod";
import { ZOD } from "../../config/appConstants.js";

export const signUpValidator = {
  body: z
    .object({
      email: ZOD.EMAIL,
      name: ZOD.NAME,
      password: ZOD.PASSWORD,
      image: ZOD.IMAGE.optional(),
      deviceId: ZOD.DEVICE_ID,
      deviceToken: ZOD.DEVICE_TOKEN,
      deviceType: ZOD.DEVICE_TYPE,
    })
    .strict(),
};

export const loginValidator = {
  body: z
    .object({
      email: ZOD.EMAIL,
      password: ZOD.PASSWORD,
      deviceId: ZOD.DEVICE_ID,
      deviceToken: ZOD.DEVICE_TOKEN,
      deviceType: ZOD.DEVICE_TYPE,
    })
    .strict(),
};

export const updateProfileValidator = {
  body: z
    .object({
      name: ZOD.NAME,
      image: ZOD.IMAGE.optional(),
    })
    .strict(),
};

export const logoutValidator = {
  body: z
    .object({
      deviceId: ZOD.DEVICE_ID,
    })
    .strict(),
};

export const changePasswordValidator = {
  body: z
    .object({
      currentPassword: ZOD.PASSWORD,
      newPassword: ZOD.PASSWORD,
    })
    .strict(),
};

export const deleteAccountValidator = {
  body: z
    .object({
      password: ZOD.PASSWORD,
    })
    .strict(),
};