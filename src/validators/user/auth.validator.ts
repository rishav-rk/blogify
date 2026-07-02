import { z } from "zod";
import { ZOD } from "../../config/appConstants.js";

export const signUpValidator = {
  body: z
    .object({
      email: ZOD.EMAIL,
      name: ZOD.NAME,
      password: ZOD.PASSWORD,
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
  body: z.object({
    name: ZOD.NAME,
    image: ZOD.IMAGE.optional(),
  }).strict()
};
