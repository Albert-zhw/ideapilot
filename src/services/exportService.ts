import { exportRepository } from "@/repositories/exportRepository";
import { buildMarkdown } from "@/lib/export/markdown";
import type { AnalysisResult } from "@/types";
import { ExportFormat } from "@prisma/client";

export const exportService = {
  async exportMarkdown(
    ideaId: string,
    userId: string,
    analysis: AnalysisResult
  ) {
    const markdown = buildMarkdown(analysis);
    await exportRepository.create({
      ideaId,
      userId,
      format: ExportFormat.MARKDOWN,
    });
    return markdown;
  },

  // 实际 PDF 在客户端用 @react-pdf/renderer 渲染下载，这里只记录导出历史
  async recordPdf(ideaId: string, userId: string) {
    await exportRepository.create({
      ideaId,
      userId,
      format: ExportFormat.PDF,
    });
  },

  async findByUserId(userId: string) {
    return exportRepository.findByUserId(userId);
  },
};
