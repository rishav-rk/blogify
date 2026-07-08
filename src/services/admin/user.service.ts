import prisma from "../../config/db.js";

export const getAllUsers = async () => {
  return prisma.user.findMany({ where: { isDeleted: false } });
};

export const approveUserActivation = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });
};

export const rejectUserActivation = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
};

export const getUserActivationRequests = async () => {
  return prisma.user.findMany({
    where: { isDeleted: false, isActive: false },
    select: { id: true, name: true, email: true },
  });
};

export const blockUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isBlocked: true },
  });
};

export const unblockUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isBlocked: false },
  });
};

