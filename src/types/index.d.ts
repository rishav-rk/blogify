import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      token?: {
        role?: string;
        user?: Prisma.UserGetPayload<{}>;
        admin?: Prisma.AdminGetPayload<{}>;
      } & Partial<Omit<Prisma.TokenGetPayload<{}>, 'user' | 'admin'>>;
    }
  }
}
