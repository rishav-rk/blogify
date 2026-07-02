import jwt from "jsonwebtoken"
import moment from "moment"
import config from "../config/config.js"
import {
  TOKEN_TYPE,
  USER_TYPE,
} from "../config/appConstants.js"
import prisma from "../config/db.js"
import { createId } from "@paralleldrive/cuid2"
import { Prisma, USER_TYPE as PrismaUserType, TOKEN_TYPE as PrismaTokenType, DEVICE_TYPE } from "@prisma/client"

const generateToken = (data: any, secret = config.jwt.secret) => {
  const payload = {
    exp: data.tokenExpires.unix(),
    type: data.tokenType,
    id: data.tokenId,
    role: data.userType,
  };

  return jwt.sign(payload, secret);
};

const getTokenId = async () => {
  while(true){
    const tokenId = createId();
    const token = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
    });
    if(!token) {
      return tokenId;
    }
  }
}

export const saveToken = async (data: Prisma.TokenUncheckedCreateInput) => {
  return await prisma.token.create({
    data,
  });
};


export const generateAuthToken = async (
  user: string,
  userType: PrismaUserType,
  deviceToken: string,
  deviceType: DEVICE_TYPE,
  deviceId: string,
  otpCode: number,
  otpExpiresAt: Date, 
  otpIsVerified: boolean,
) => {
  const tokenExpires = moment().add(config.jwt.expirationDays, "days");
  const tokenId = await getTokenId();
  const token = generateToken({ tokenExpires, tokenType: TOKEN_TYPE.ACCESS as PrismaTokenType, tokenId, userType })
  
  const dataToBeSaved: Prisma.TokenUncheckedCreateInput = {
    id: tokenId,
    token , 
    deviceId, 
    deviceToken,
    deviceType,
    otpCode,
    otpExpiresAt,
    otpIsVerified,
    type: TOKEN_TYPE.ACCESS as PrismaTokenType,
    expires: tokenExpires.toISOString(),
    role: userType,
  }

  if(userType === PrismaUserType.user) {
    dataToBeSaved.userId = user
  } else if(userType === PrismaUserType.admin) {
    dataToBeSaved.adminId = user;
  }
  
  await saveToken(dataToBeSaved);

  return {
    token,
    expires: tokenExpires.toDate(),
    tokenId,
  }
}
