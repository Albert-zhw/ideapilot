import { prisma } from "@/lib/db";

export const adminService = {
  async getStats() {
    const [userCount, ideaCount, analysisCount, shareCount, exportCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.idea.count(),
        prisma.analysisResult.count(),
        prisma.share.count(),
        prisma.export.count(),
      ]);

    return {
      userCount,
      ideaCount,
      analysisCount,
      shareCount,
      exportCount,
    };
  },

  async getTagDistribution() {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { ideas: true } },
      },
    });
    return tags.map((t) => ({
      name: t.name,
      color: t.color,
      count: t._count.ideas,
    }));
  },

  async getRecentIdeas(limit = 20) {
    return prisma.idea.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        analysis: true,
        user: { select: { name: true, email: true } },
      },
    });
  },

  async getRecentShares(limit = 20) {
    return prisma.share.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        idea: { select: { title: true } },
        user: { select: { name: true } },
      },
    });
  },
};
