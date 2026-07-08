import prisma from "../../config/db.js";

export const getDashboardStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  return { totalUsers, totalPosts };
};

export const getRecentPosts = async () => {
  return prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });
};

export const getRecentUsers = async () => {
  return prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });
};

export const getAllActiveUsers = async (page: number, limit: number) => {
  const activeUsers = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true, createdAt: true },
    take: limit,
    skip: page * limit,
  });
  return {
    activeUsers,
    page,
    pageSize: limit,
    totalUsers: await prisma.user.count({ where: { isActive: true } }),
  };
};

export const getAllPublishedPosts = async (page: number, limit: number) => {
  const publishedPosts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { id: true, title: true, slug: true },
    take: limit,
    skip: page * limit,
  });
  return {
    publishedPosts,
    page,
    pageSize: limit,
    totalPosts: await prisma.post.count({ where: { isPublished: true } }),
  };
};
