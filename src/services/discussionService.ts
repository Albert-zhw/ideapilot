import { prisma } from "@/lib/db";
import type { ChatMessage, Conversation, DevelopmentPrompt } from "@prisma/client";

type ConversationWithMessages = Conversation & { messages: ChatMessage[] };

interface SendMessageInput {
  ideaId: string;
  userId: string;
  content: string;
}

const QUICK_PROMPTS = [
  "深化痛点：请帮我把这个项目的用户痛点讲得更具体、更有比赛冲击力。",
  "压缩 MVP：请把这个项目改成 3 天内可完成的最小可演示版本。",
  "生成路演稿：请输出 1 分钟初赛路演稿，突出创新点和可落地性。",
  "生成评委问答：请预测 5 个评委问题并给出回答。",
  "生成开发计划：请拆成可交给 TRAE 实现的阶段任务。",
  "生成初赛提交文案：请输出适合比赛报名帖/初赛提交的正式文案。",
];

export const discussionService = {
  async ensureConversation(ideaId: string, userId: string): Promise<ConversationWithMessages> {
    const existing = await prisma.conversation.findFirst({
      where: { ideaId, userId, status: "ACTIVE" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (existing) return existing;

    const idea = await prisma.idea.findFirst({
      where: { id: ideaId, userId },
      include: { analysis: true },
    });
    if (!idea) throw new Error("想法不存在");

    const opener = buildOpeningQuestion(idea.title ?? idea.rawText);
    return prisma.conversation.create({
      data: {
        ideaId,
        userId,
        title: idea.title ?? "方案研讨",
        messages: {
          create: {
            role: "ASSISTANT",
            kind: "QUESTION",
            content: opener,
          },
        },
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  },

  async sendMessage(input: SendMessageInput): Promise<ConversationWithMessages> {
    if (!input.content.trim()) throw new Error("消息不能为空");
    const conversation = await this.ensureConversation(input.ideaId, input.userId);
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: input.content.trim(),
      },
    });

    const idea = await prisma.idea.findFirst({
      where: { id: input.ideaId, userId: input.userId },
      include: { analysis: true },
    });
    if (!idea) throw new Error("想法不存在");

    const reply = buildCoachReply(input.content, idea);
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        kind: detectMessageKind(input.content),
        content: reply,
      },
    });

    return prisma.conversation.findUniqueOrThrow({
      where: { id: conversation.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  },

  async generateDevelopmentPrompt(ideaId: string, userId: string): Promise<DevelopmentPrompt> {
    const idea = await prisma.idea.findFirst({
      where: { id: ideaId, userId },
      include: { analysis: true, tags: { include: { tag: true } } },
    });
    if (!idea || !idea.analysis) throw new Error("请先完成方案分析");

    const conversation = await this.ensureConversation(ideaId, userId);
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });

    const currentVersion = await prisma.developmentPrompt.count({ where: { ideaId, userId } });
    const content = buildDevelopmentPrompt(idea, messages);

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: "CONFIRMED" },
    });

    return prisma.developmentPrompt.create({
      data: {
        ideaId,
        userId,
        content,
        version: currentVersion + 1,
      },
    });
  },

  async getLatestDevelopmentPrompt(ideaId: string, userId: string) {
    return prisma.developmentPrompt.findFirst({
      where: { ideaId, userId },
      orderBy: { version: "desc" },
    });
  },

  quickPrompts() {
    return QUICK_PROMPTS;
  },
};

function buildOpeningQuestion(title: string): string {
  return `我已经生成了「${title}」的第一版方案。为了把它打磨成可参赛、可开发、可交给 TRAE 实现的项目，我建议你继续补充 3 个信息：\n\n1. 你希望最终做网页、App、小程序还是浏览器 Demo？\n2. 初赛更想突出技术创新、社会价值，还是视觉冲击力？\n3. 你希望 TRAE 最终实现到什么程度：可演示原型、完整全栈应用，还是可部署版本？`;
}

function detectMessageKind(content: string): "NORMAL" | "QUESTION" | "SUGGESTION" | "PROMPT" {
  if (content.includes("TRAE") || content.includes("提示词")) return "PROMPT";
  if (content.includes("？") || content.includes("?")) return "QUESTION";
  if (content.includes("生成") || content.includes("帮我")) return "SUGGESTION";
  return "NORMAL";
}

function buildCoachReply(content: string, idea: { rawText: string; title: string | null }) {
  const lower = content.toLowerCase();
  const title = idea.title ?? idea.rawText;

  if (content.includes("MVP") || content.includes("mvp") || content.includes("3 天") || content.includes("三天")) {
    return `可以。针对「${title}」，我建议把 MVP 压缩成 3 天可完成版本：\n\n第 1 天：完成首页、登录、核心工作台和基础数据模型。\n第 2 天：完成核心交互流程、AI mock 降级、结果展示和保存。\n第 3 天：完成导出、分享、管理后台基础统计、视觉打磨和部署预览。\n\n保留最能打动评委的闭环，不做复杂边缘功能。MVP 的重点不是功能多，而是能清楚证明：用户输入想法后，系统能持续研讨，并最终生成可交给 TRAE 实现的开发提示词。`;
  }

  if (content.includes("评委") || content.includes("问答")) {
    return `这里是「${title}」可能遇到的评委问答：\n\nQ1：它和普通 ChatGPT 问答有什么区别？\nA：普通问答只回答单次问题，IdeaPilot 把创意拆成结构化方案、多轮研讨记录和最终开发提示词，形成从创意到代码实现的闭环。\n\nQ2：为什么适合创造力大赛？\nA：它服务的正是参赛者最痛的环节：有想法但不知道如何落地、如何表达、如何交给 AI 编程工具实现。\n\nQ3：如何证明可落地？\nA：最终输出包含技术栈、页面路由、数据模型、功能清单、验收标准和阶段计划，可直接复制给 TRAE 开始实现。`;
  }

  if (content.includes("路演") || content.includes("演讲")) {
    return `1 分钟路演稿建议：\n\n大家好，我的项目是「${title}」。很多创造力大赛参赛者都有一个模糊灵感，但真正困难的是把它变成可开发、可展示、可路演的项目。IdeaPilot 就是一个 AI 项目教练：用户输入一句想法，它会先生成结构化方案，再通过多轮研讨持续追问和优化，最后生成一份可以直接交给 TRAE 实现的完整开发提示词。它不是一次性文案生成器，而是把创造力转化为代码实现的桥梁。`;
  }

  if (content.includes("开发") || content.includes("TRAE") || lower.includes("trae") || content.includes("提示词")) {
    return `下一步可以生成 TRAE 开发提示词。它会包含项目目标、页面路由、数据模型、业务流程、AI 能力、UI 风格、实现阶段和验收标准。建议你先确认：\n\n1. 项目是做全栈 Web 应用还是纯前端 Demo？\n2. 是否需要登录注册和数据库？\n3. 是否需要真实 AI Key，还是允许 mock 降级？\n\n确认后点击「生成 TRAE 开发提示词」，就能复制到 TRAE 新会话里直接开工。`;
  }

  return `针对「${title}」，我的教练建议是：先把比赛表达聚焦到一个强闭环。\n\n可以从三点打磨：\n1. 用户痛点：谁在什么场景下真的需要它。\n2. Demo 闭环：评委 1 分钟内能否看懂完整流程。\n3. 开发提示词：最终能否交给 TRAE 直接实现。\n\n你可以继续问我：深化痛点、压缩 MVP、生成评委问答、生成路演稿，或者直接生成 TRAE 开发提示词。`;
}

function buildDevelopmentPrompt(
  idea: {
    rawText: string;
    title: string | null;
    analysis: {
      title: string;
      track: string;
      targetUser: string;
      painPoint: string;
      mvp: string;
      demoRoute: string;
      tasks: string;
      pitch: string;
      canvas: string;
    } | null;
    tags: { tag: { name: string } }[];
  },
  messages: ChatMessage[]
) {
  const analysis = idea.analysis;
  if (!analysis) throw new Error("请先完成方案分析");

  const mvp = safeParse<string[]>(analysis.mvp, []);
  const tasks = safeParse<string[]>(analysis.tasks, []);
  const canvas = safeParse<Record<string, string>>(analysis.canvas, {});
  const discussions = messages
    .slice(-8)
    .map((m) => `${m.role === "USER" ? "用户" : "AI教练"}：${m.content}`)
    .join("\n\n");

  return `你是 TRAE AI，请根据以下需求实现一个完整可运行的 Web 应用。\n\n一、项目名称\n${analysis.title || idea.title || "未命名项目"}\n\n二、项目目标\n把用户的创意「${idea.rawText}」实现成一个可演示、可部署、可迭代的创造力大赛项目。\n\n三、参赛赛道\n${analysis.track}\n\n四、目标用户\n${analysis.targetUser}\n\n五、核心痛点\n${analysis.painPoint}\n\n六、核心功能清单\n${mvp.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n七、Demo 演示路线\n${analysis.demoRoute}\n\n八、开发任务拆解\n${tasks.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n九、商业/项目画布\n${Object.entries(canvas)
    .map(([key, value]) => `- ${key}：${value}`)
    .join("\n")}\n\n十、推荐技术栈\n- Next.js App Router\n- TypeScript\n- TailwindCSS\n- Prisma ORM\n- SQLite 本地开发，PostgreSQL 生产部署\n- NextAuth.js 登录注册\n- AI 能力需要支持真实接口和 mock 降级\n\n十一、页面路由建议\n- / 首页：展示项目价值、核心流程和 CTA\n- /login 登录页\n- /register 注册页\n- /workspace 或 /dashboard 核心工作台\n- /items/[id] 详情页\n- /profile 个人中心\n- /admin 管理后台\n\n十二、UI 风格要求\n视觉需要有比赛展示感，避免普通后台模板。使用深色科技感、玻璃拟态、渐变高光、清晰卡片层级和适度动效。所有关键交互必须能在 1 分钟内演示清楚。\n\n十三、AI 能力要求\n- 有真实 AI Key 时调用真实模型\n- 没有 AI Key 时使用 mock 结果，保证本地和 Vercel 预览可演示\n- AI 输出需要结构化保存，方便导出和二次编辑\n\n十四、最近研讨记录\n${discussions || "暂无额外研讨记录"}\n\n十五、验收标准\n1. npm run dev 能正常启动。\n2. npm run build 必须通过。\n3. npm run lint 必须通过。\n4. 核心页面可访问，核心流程可完整演示。\n5. 支持数据持久化。\n6. 支持 mock 降级，不能因为没有 AI Key 导致演示失败。\n7. 提供可复制、可导出的最终结果。\n\n十六、实现阶段\n阶段 1：初始化项目、数据库 schema 和基础主题。\n阶段 2：实现认证、数据访问层和核心业务服务。\n阶段 3：实现核心页面和完整用户流程。\n阶段 4：接入 AI 能力、导出能力和 mock 降级。\n阶段 5：实现管理后台、测试、构建和 Vercel 部署准备。\n\n请严格按照以上需求实现，优先保证可运行、可演示、可部署。`;
}

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
