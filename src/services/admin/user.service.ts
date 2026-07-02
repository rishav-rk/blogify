import prisma from "../../config/db.js";

export const getAllUsers = async () => {
  return prisma.user.findMany({ where: { isDeleted: false } });
};

export const enableDisableUser = async (userId: number) => {

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true , isActive: true}
  })

  if (!userExists) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {isActive : !userExists.isActive},
  })
};
