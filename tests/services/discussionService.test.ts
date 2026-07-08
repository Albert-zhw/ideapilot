import { describe, it, expect } from "vitest";
import { discussionService } from "@/services/discussionService";
import { prisma } from "@/lib/db";

describe("discussionService", () => {
  it("创建研讨会话时应生成开场追问", async () => {
    const idea = await prisma.idea.findFirst({
      where: { user: { email: "demo@ideapilot.app" } },
      include: { user: true },
    });
    expect(idea).not.toBeNull();

    const conversation = await discussionService.ensureConversation(idea!.id, idea!.userId);
    expect(conversation.ideaId).toBe(idea!.id);
    expect(conversation.messages.length).toBeGreaterThanOrEqual(1);
    expect(conversation.messages[0].role).toBe("ASSISTANT");
    expect(conversation.messages[0].content).toContain("补充");
  });

  it("发送用户消息后应追加教练回复", async () => {
    const idea = await prisma.idea.findFirst({
      where: { user: { email: "demo@ideapilot.app" } },
    });
    expect(idea).not.toBeNull();

    const conversation = await discussionService.ensureConversation(idea!.id, idea!.userId);
    const before = conversation.messages.length;
    const updated = await discussionService.sendMessage({
      ideaId: idea!.id,
      userId: idea!.userId,
      content: "帮我把 MVP 压缩成 3 天能完成的版本",
    });

    expect(updated.messages.length).toBe(before + 2);
    expect(updated.messages.at(-2)?.role).toBe("USER");
    expect(updated.messages.at(-1)?.role).toBe("ASSISTANT");
    expect(updated.messages.at(-1)?.content).toContain("MVP");
  });

  it("生成 TRAE 开发提示词应保存版本并包含验收标准", async () => {
    const idea = await prisma.idea.findFirst({
      where: { user: { email: "demo@ideapilot.app" } },
    });
    expect(idea).not.toBeNull();

    const prompt = await discussionService.generateDevelopmentPrompt(idea!.id, idea!.userId);
    expect(prompt.content).toContain("你是 TRAE AI");
    expect(prompt.content).toContain("验收标准");
    expect(prompt.content).toContain("npm run build");
    expect(prompt.version).toBeGreaterThanOrEqual(1);
  });
});
