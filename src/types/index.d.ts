import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      token?: {
        id?: string
        role?: string;
        user?: Prisma.UserGetPayload<{}>;
        admin?: Prisma.AdminGetPayload<{}>;
        password?: string
      } & Partial<Omit<Prisma.TokenGetPayload<{}>, 'user' | 'admin'>>;
    }
  }
}
