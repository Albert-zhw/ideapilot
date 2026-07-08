import { prisma } from "@/lib/db";

export const templateRepository = {
  async findAll() {
    return prisma.template.findMany({
      where: { isActive: true },
      orderBy: { track: "asc" },
    });
  },

  async findAllAdmin() {
    return prisma.template.findMany({
      orderBy: { track: "asc" },
    });
  },

  async findByTrack(track: string) {
    return prisma.template.findUnique({ where: { track } });
  },

  async create(data: {
    track: string;
    exampleInput: string;
    exampleOutput: string;
  }) {
    return prisma.template.create({ data });
  },

  async update(
    track: string,
    data: { exampleInput?: string; exampleOutput?: string; isActive?: boolean }
  ) {
    return prisma.template.update({ where: { track }, data });
  },

  async delete(track: string) {
    return prisma.template.delete({ where: { track } });
  },
};
