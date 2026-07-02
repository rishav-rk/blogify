import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import prisma from "./db.js";
import config from "./config.js";
import { USER_TYPE } from "./appConstants.js";
import { tokenUserSelection } from "../utils/dbUtils.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const jwtVerifyCallback = async (payload: any, done: any) => {
  try {
    let token;
    if (payload.role === USER_TYPE.USER) {
      token = await prisma.token.findUnique({
        where: { id: payload.id },
        include: { user: {
          select: tokenUserSelection
        } }
      });
    } else if (payload.role === USER_TYPE.ADMIN) {
      token = await prisma.token.findUnique({
        where: { id: payload.id },
        include: { admin: {
          select: tokenUserSelection
        } },
      });
    }

    if (token?.isDeleted) {
      return done(null, false);
    }

    return done(null, token);
  } catch (error) {
    console.error("Error in jwtVerifyCallback: ", error);
    return done(error, false);
  }
};
const JwtStrategy = new JWTStrategy(options, jwtVerifyCallback);

export default JwtStrategy;
