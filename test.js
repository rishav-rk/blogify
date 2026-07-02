import prisma from "./src/config/db.ts";

console.log(
  await prisma.user.update({
    where: { email: "rk@test.com" },
    data: { isActive: true },
  }),
);
