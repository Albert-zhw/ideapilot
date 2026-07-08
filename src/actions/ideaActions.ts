"use server";

import { getSession } from "@/lib/auth";
import { ideaService } from "@/services/ideaService";

export async function getMyIdeas() {
  const session = await getSession();
  if (!session) return [];
  return ideaService.findByUserId(session.user.id);
}

export async function getIdea(id: string) {
  const session = await getSession();
  if (!session) return null;
  return ideaService.findById(id, session.user.id);
}

export async function deleteIdea(id: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "未登录" };
  const ok = await ideaService.delete(id, session.user.id);
  if (!ok) return { error: "想法不存在或无权删除" };
  return {};
}
