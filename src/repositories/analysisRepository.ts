import { prisma } from "@/lib/db";

export const analysisRepository = {
  async create(data: {
    ideaId: string;
    track: string;
    targetUser: string;
    painPoint: string;
    mvp: string;
    demoRoute: string;
    tasks: string;
    pitch: string;
    canvas: string;
    title: string;
    tags: string;
    modelUsed: string;
    tokensUsed: number;
  }) {
    return prisma.analysisResult.create({ data });
  },

  async findByIdeaId(ideaId: string) {
    return prisma.analysisResult.findUnique({
      where: { ideaId },
    });
  },

  async count() {
    return prisma.analysisResult.count();
  },
};
