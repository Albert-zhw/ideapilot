import { prisma } from "@/lib/db";
import { IdeaStatus } from "@prisma/client";

export const ideaRepository = {
  async create(data: { userId: string; rawText: string; title?: string }) {
    return prisma.idea.create({ data });
  },

  async findById(id: string) {
    return prisma.idea.findUnique({
      where: { id },
      include: {
        analysis: true,
        tags: { include: { tag: true } },
      },
    });
  },

  async findByUserId(userId: string) {
    return prisma.idea.findMany({
      where: { userId },
      include: {
        analysis: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findAll() {
    return prisma.idea.findMany({
      include: {
        analysis: true,
        tags: { include: { tag: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async delete(id: string, userId: string) {
    return prisma.idea.deleteMany({ where: { id, userId } });
  },

  async deleteById(id: string) {
    return prisma.idea.delete({ where: { id } });
  },

  async updateTitle(id: string, title: string) {
    return prisma.idea.update({ where: { id }, data: { title } });
  },

  async updateStatus(id: string, status: IdeaStatus) {
    return prisma.idea.update({ where: { id }, data: { status } });
  },

  async count() {
    return prisma.idea.count();
  },
};
