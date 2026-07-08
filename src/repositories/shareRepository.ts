import { prisma } from "@/lib/db";

export const shareRepository = {
  async create(data: {
    ideaId: string;
    userId: string;
    token: string;
    expiresAt?: Date | null;
  }) {
    return prisma.share.create({ data });
  },

  async findByToken(token: string) {
    return prisma.share.findUnique({
      where: { token },
      include: {
        idea: {
          include: {
            analysis: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    });
  },

  async findByIdeaId(ideaId: string) {
    return prisma.share.findMany({
      where: { ideaId },
      orderBy: { createdAt: "desc" },
    });
  },

  async incrementViewCount(token: string) {
    return prisma.share.update({
      where: { token },
      data: { viewCount: { increment: 1 } },
    });
  },

  async delete(id: string) {
    return prisma.share.delete({ where: { id } });
  },

  async count() {
    return prisma.share.count();
  },
};
