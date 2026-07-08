"use server";

import { getSession } from "@/lib/auth";
import { analysisService } from "@/services/analysisService";

export async function analyzeIdeaAction(rawText: string) {
  const session = await getSession();
  if (!session) throw new Error("请先登录");
  if (!rawText || rawText.trim().length < 2) {
    throw new Error("想法至少 2 个字");
  }
  return analysisService.analyze(rawText.trim(), session.user.id);
}
