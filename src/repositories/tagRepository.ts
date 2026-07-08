import { prisma } from "@/lib/db";

export const tagRepository = {
  async findOrCreate(name: string, color?: string) {
    return prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, color: color ?? "#6fe8ff" },
    });
  },

  async findByName(name: string) {
    return prisma.tag.findUnique({ where: { name } });
  },

  async findAll() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  },

  async linkToIdea(ideaId: string, tagId: string) {
    return prisma.ideaTag.create({ data: { ideaId, tagId } });
  },

  async unlinkAllFromIdea(ideaId: string) {
    return prisma.ideaTag.deleteMany({ where: { ideaId } });
  },

  async findByIdeaId(ideaId: string) {
    return prisma.ideaTag.findMany({
      where: { ideaId },
      include: { tag: true },
    });
  },
};
