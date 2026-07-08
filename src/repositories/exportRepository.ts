import { prisma } from "@/lib/db";
import { ExportFormat } from "@prisma/client";

export const exportRepository = {
  async create(data: {
    ideaId: string;
    userId: string;
    format: ExportFormat;
    fileUrl?: string;
  }) {
    return prisma.export.create({ data });
  },

  async findByUserId(userId: string) {
    return prisma.export.findMany({
      where: { userId },
      include: { idea: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async count() {
    return prisma.export.count();
  },
};
