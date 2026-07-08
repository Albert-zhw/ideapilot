import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "./prompt";
import type { AnalysisResult, AnalyzeResponse } from "@/types";

const AnalysisSchema = z.object({
  track: z.string(),
  targetUser: z.string(),
  painPoint: z.string(),
  mvp: z.array(z.string()).length(4),
  demoRoute: z.string(),
  tasks: z.array(z.string()).length(4),
  pitch: z.string(),
  canvas: z.object({
    user: z.string(),
    pain: z.string(),
    solution: z.string(),
    mvp: z.string(),
    diff: z.string(),
    next: z.string(),
  }),
  title: z.string(),
  tags: z.array(z.string()),
});

export async function analyzeIdea(rawText: string): Promise<AnalyzeResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return mockAnalyzeIdea(rawText);
  }

  try {
    const { object, usage } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt: `请分析这个想法：${rawText}`,
      schema: AnalysisSchema,
    });
    return {
      result: object as AnalysisResult,
      modelUsed: "gpt-4o-mini",
      tokensUsed: usage.totalTokens ?? 0,
      source: "ai",
    };
  } catch (error) {
    console.error("LLM 调用失败，降级为模拟分析:", error);
    return mockAnalyzeIdea(rawText);
  }
}

// 降级模拟：基于关键词匹配的本地分析引擎
function mockAnalyzeIdea(rawText: string): AnalyzeResponse {
  const text = rawText.toLowerCase();

  // 关键词匹配规则
  const rules: Array<{
    keywords: string[];
    track: string;
    result: Omit<AnalysisResult, "title" | "tags">;
    tags: string[];
  }> = [
    {
      keywords: ["视障", "盲", "导航", "无障碍", "轮椅", "残障", "老人", "公益", "助残", "出行"],
      track: "社会服务·无障碍",
      tags: ["社会服务"],
      result: {
        track: "社会服务·无障碍（聚焦弱势群体的真实出行/生活痛点）",
        targetUser: "视障者/轮椅用户/独居老人等行动受限人群",
        painPoint: "现有方案覆盖主干场景，但最后一段路/最细的需求无人管",
        mvp: ["场景化引导", "实时风险提醒", "一键求助", "公益数据沉淀"],
        demoRoute: "首页→选择场景→开始体验→实时引导→反馈闭环",
        tasks: ["梳理 3-5 个真实场景", "实现核心引导逻辑", "设计反馈机制", "搭建公益看板"],
        pitch: "聚焦最后 20 米的真实痛点，让每一次使用都成为一次公益贡献。",
        canvas: {
          user: "行动受限人群",
          pain: "最后一段路没人管",
          solution: "场景化引导 + 风险提醒",
          mvp: "引导+提醒+求助+反馈",
          diff: "聚焦细分最后一段",
          next: "跑通 3 个核心场景",
        },
      },
    },
    {
      keywords: ["学生", "错题", "学习", "复习", "考试", "课程", "老师", "教学", "背单词", "作业"],
      track: "学习工作·教育",
      tags: ["学习工作"],
      result: {
        track: "学习工作·教育（帮学生/职场人提升学习与工作效率）",
        targetUser: "中学生/大学生/备考人群，自制力一般、方法不当",
        painPoint: "学了忘、错了再错，缺乏科学的复习和反馈机制",
        mvp: ["智能录入", "知识标签", "间隔复习", "数据可视化"],
        demoRoute: "录入→自动打标→复习提醒→效果统计",
        tasks: ["设计录入流程", "实现标签体系", "接入 SM-2 算法", "生成学习报告"],
        pitch: "用 AI 把零散的学习变成有节奏的复利，让每一分钟都不白学。",
        canvas: {
          user: "备考学生",
          pain: "学了忘、错了再错",
          solution: "智能录入 + 间隔复习",
          mvp: "录入+标签+复习+统计",
          diff: "AI 驱动的个性化复习",
          next: "先做一个学科跑通",
        },
      },
    },
    {
      keywords: ["老人", "独居", "陪伴", "聊天", "心情", "娱乐", "游戏", "社交", "宠物", "爱好"],
      track: "生活娱乐·陪伴",
      tags: ["生活娱乐"],
      result: {
        track: "生活娱乐·陪伴（关注情感与精神生活质量）",
        targetUser: "独居老人/孤独的年轻人，缺乏日常陪伴与情感反馈",
        painPoint: "孤独感强，想找人说话时没人听，情绪无法及时疏导",
        mvp: ["主动问候", "语音聊天", "兴趣匹配", "情绪记录"],
        demoRoute: "开机→主动问候→自由聊天→记录心情",
        tasks: ["设计问候库", "接入语音能力", "实现兴趣匹配", "搭建情绪日历"],
        pitch: "一个会主动找你聊天的伙伴，让独处不再等于孤独。",
        canvas: {
          user: "独居人群",
          pain: "孤独没人陪",
          solution: "主动式 AI 陪伴",
          mvp: "问候+聊天+匹配+记录",
          diff: "主动而非被动响应",
          next: "先跑通每日问候",
        },
      },
    },
    {
      keywords: ["会议", "记录", "清单", "任务", "效率", "时间", "管理", "自动化", "工作流", "办公"],
      track: "效率工具·协作",
      tags: ["效率工具"],
      result: {
        track: "效率工具·协作（帮职场人减少重复劳动、提升协作效率）",
        targetUser: "职场人，会议多、任务杂、跟进难",
        painPoint: "信息散落在多个工具里，手动整理耗时且容易遗漏",
        mvp: ["自动采集", "智能抽取", "任务分配", "进度跟踪"],
        demoRoute: "输入/录音→自动结构化→抽取行动项→跟踪看板",
        tasks: ["设计采集入口", "实现抽取算法", "搭建看板", "集成通知"],
        pitch: "把会后 30 分钟的人工整理，变成 30 秒的自动产出。",
        canvas: {
          user: "忙碌的职场人",
          pain: "信息散、整理慢",
          solution: "自动采集 + 智能抽取",
          mvp: "采集+抽取+分配+跟踪",
          diff: "端到端自动化",
          next: "先支持会议场景",
        },
      },
    },
  ];

  // 匹配关键词
  let matched = rules.find((r) => r.keywords.some((k) => text.includes(k)));

  if (!matched) {
    // 通用模板
    matched = {
      keywords: [],
      track: "通用·个人成长",
      tags: ["通用"],
      result: {
        track: "通用·个人成长（帮普通人把模糊想法变成可执行方案）",
        targetUser: "有想法但不知道怎么落地的普通人",
        painPoint: "想法停留在脑子里，缺乏结构化的拆解和第一步行动",
        mvp: ["想法录入", "结构拆解", "行动清单", "进度追踪"],
        demoRoute: "输入想法→AI 拆解→查看方案→开始行动",
        tasks: ["设计输入流程", "实现拆解逻辑", "生成行动清单", "搭建追踪页"],
        pitch: "把'我有个想法'变成'我可以开始做了'，让好想法不再死在'然后呢'。",
        canvas: {
          user: "有想法的普通人",
          pain: "想法死在'然后呢'",
          solution: "结构化拆解 + 行动清单",
          mvp: "录入+拆解+清单+追踪",
          diff: "聚焦从 0 到 1 的第一步",
          next: "先支持 3 类常见想法",
        },
      },
    };
  }

  // 生成标题（取前 8 个字 + 省略号）
  const title =
    rawText.length > 8 ? rawText.slice(0, 8) + "…" : rawText || "新想法";

  const result: AnalysisResult = {
    ...matched.result,
    title,
    tags: matched.tags,
  };

  return {
    result,
    modelUsed: "mock-keyword",
    tokensUsed: 0,
    source: "mock",
  };
}
