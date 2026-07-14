import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import prisma from "./db.js";
import config from "./config.js";
import { tokenUserSelection } from "../utils/dbUtils.js";
import { USER_TYPE as PrismaUserType } from "@prisma/client";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const jwtVerifyCallback = async (payload: any, done: any) => {
  try {
    let token;
    if (payload.role === PrismaUserType.user) {
      token = await prisma.token.findUnique({
        where: { id: payload.id },
        include: { user: {
          select: tokenUserSelection
        } }
      });
    } else if (payload.role === PrismaUserType.admin) {
      token = await prisma.token.findUnique({
        where: { id: payload.id },
        include: { admin: {
          select: tokenUserSelection
        } },
      });
    }

    return done(null, token);
  } catch (error) {
    console.error("Error in jwtVerifyCallback: ", error);
    return done(error, false);
  }
};
const JwtStrategy = new JWTStrategy(options, jwtVerifyCallback);

export default JwtStrategy;
