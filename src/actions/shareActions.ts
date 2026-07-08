"use server";

import { getSession } from "@/lib/auth";
import { shareService } from "@/services/shareService";

export async function createShare(ideaId: string) {
  const session = await getSession();
  if (!session) throw new Error("未登录");
  return shareService.create(ideaId, session.user.id);
}

export async function getShareByToken(token: string) {
  return shareService.findByTokenAndIncrement(token);
}
