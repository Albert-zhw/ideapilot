"use server";

import { revalidatePath } from "next/cache";
import { discussionService } from "@/services/discussionService";
import { getSession } from "@/lib/auth";

async function requireSessionUser() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("请先登录");
  return session.user;
}

export async function getConversationAction(ideaId: string) {
  const user = await requireSessionUser();
  return discussionService.ensureConversation(ideaId, user.id);
}

export async function sendDiscussionMessageAction(ideaId: string, content: string) {
  const user = await requireSessionUser();
  const conversation = await discussionService.sendMessage({
    ideaId,
    userId: user.id,
    content,
  });
  revalidatePath(`/ideas/${ideaId}`);
  return conversation;
}

export async function generateDevelopmentPromptAction(ideaId: string) {
  const user = await requireSessionUser();
  const prompt = await discussionService.generateDevelopmentPrompt(ideaId, user.id);
  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath(`/ideas/${ideaId}/prompt`);
  return prompt;
}

export async function getLatestDevelopmentPromptAction(ideaId: string) {
  const user = await requireSessionUser();
  return discussionService.getLatestDevelopmentPrompt(ideaId, user.id);
}

export async function getQuickPromptsAction() {
  return discussionService.quickPrompts();
}
