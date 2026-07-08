"use server";

import { getSession } from "@/lib/auth";
import { exportService } from "@/services/exportService";
import { analysisService } from "@/services/analysisService";
import type { AnalysisResult } from "@/types";

export async function exportMarkdownAction(
  ideaId: string,
  analysisRow: {
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
  }
): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error("未登录");
  const analysis: AnalysisResult = analysisService.parseAnalysis(analysisRow);
  return exportService.exportMarkdown(ideaId, session.user.id, analysis);
}

export async function recordPdfExportAction(ideaId: string): Promise<{ success: boolean }> {
  const session = await getSession();
  if (!session) throw new Error("未登录");
  await exportService.recordPdf(ideaId, session.user.id);
  return { success: true };
}
