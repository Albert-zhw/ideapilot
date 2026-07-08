import { ideaRepository } from "@/repositories/ideaRepository";
import { analysisRepository } from "@/repositories/analysisRepository";
import { tagRepository } from "@/repositories/tagRepository";
import { analyzeIdea } from "@/lib/ai/analyze";
import type { AnalysisResult } from "@/types";

export const analysisService = {
  async analyze(rawText: string, userId: string) {
    // 1. 创建想法记录
    const idea = await ideaRepository.create({ userId, rawText });

    // 2. 调 LLM 分析（含降级模拟）
    const { result, modelUsed, tokensUsed, source } = await analyzeIdea(rawText);

    // 3. 存分析结果（JSON 字段序列化为字符串）
    const analysis = await analysisRepository.create({
      ideaId: idea.id,
      track: result.track,
      targetUser: result.targetUser,
      painPoint: result.painPoint,
      mvp: JSON.stringify(result.mvp),
      demoRoute: result.demoRoute,
      tasks: JSON.stringify(result.tasks),
      pitch: result.pitch,
      canvas: JSON.stringify(result.canvas),
      title: result.title,
      tags: JSON.stringify(result.tags),
      modelUsed,
      tokensUsed,
    });

    // 4. 更新想法标题
    await ideaRepository.updateTitle(idea.id, result.title);

    // 5. 关联标签（不存在则创建）
    const tagColors: Record<string, string> = {
      社会服务: "#6fe8ff",
      学习工作: "#2f7bff",
      生活娱乐: "#a66bff",
      效率工具: "#ff6f9c",
      通用: "#6fff8e",
    };
    for (const tagName of result.tags) {
      const tag = await tagRepository.findOrCreate(
        tagName,
        tagColors[tagName] ?? "#6fe8ff"
      );
      await tagRepository.linkToIdea(idea.id, tag.id);
    }

    return { idea, analysis, source };
  },

  // 把数据库行反序列化为前端可用的 AnalysisResult
  parseAnalysis(row: {
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
  }): AnalysisResult {
    return {
      track: row.track,
      targetUser: row.targetUser,
      painPoint: row.painPoint,
      mvp: JSON.parse(row.mvp),
      demoRoute: row.demoRoute,
      tasks: JSON.parse(row.tasks),
      pitch: row.pitch,
      canvas: JSON.parse(row.canvas),
      title: row.title,
      tags: JSON.parse(row.tags),
    };
  },
};
