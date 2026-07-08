import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export const userRepository = {
  async create(data: {
    email: string;
    passwordHash: string;
    name?: string;
    role?: Role;
  }) {
    return prisma.user.create({ data });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async updateProfile(id: string, data: { name?: string; avatar?: string }) {
    return prisma.user.update({ where: { id }, data });
  },

  async updateRole(id: string, role: Role) {
    return prisma.user.update({ where: { id }, data: { role } });
  },

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async count() {
    return prisma.user.count();
  },
};
