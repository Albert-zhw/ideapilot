import { describe, it, expect } from "vitest";
import { analyzeIdea } from "@/lib/ai/analyze";

describe("analyzeIdea（降级模拟模式）", () => {
  it("应该返回完整的六维结构", async () => {
    const { result, source } = await analyzeIdea("我想做个帮视障者导航的 App");
    expect(source).toBe("mock");
    expect(result.track).toBeTruthy();
    expect(result.targetUser).toBeTruthy();
    expect(result.painPoint).toBeTruthy();
    expect(result.mvp).toHaveLength(4);
    expect(result.tasks).toHaveLength(4);
    expect(result.pitch).toBeTruthy();
    expect(result.canvas).toBeDefined();
    expect(result.canvas.user).toBeTruthy();
    expect(result.canvas.pain).toBeTruthy();
    expect(result.title).toBeTruthy();
    expect(result.tags).toBeInstanceOf(Array);
  });

  it("社会服务类关键词应匹配社会服务赛道", async () => {
    const { result } = await analyzeIdea("帮视障者导航最后20米");
    expect(result.track).toContain("社会服务");
    expect(result.tags).toContain("社会服务");
  });

  it("学习工作类关键词应匹配学习工作赛道", async () => {
    const { result } = await analyzeIdea("学生错题智能复习");
    expect(result.track).toContain("学习工作");
    expect(result.tags).toContain("学习工作");
  });

  it("效率工具类关键词应匹配效率工具赛道", async () => {
    const { result } = await analyzeIdea("把会议录音直接变成行动清单");
    expect(result.track).toContain("效率工具");
    expect(result.tags).toContain("效率工具");
  });

  it("无法匹配的输入应降级为通用赛道", async () => {
    const { result } = await analyzeIdea("一个全新的 xyz 想法");
    expect(result.track).toContain("通用");
    expect(result.tags).toContain("通用");
  });

  it("modelUsed 应标记为 mock", async () => {
    const { modelUsed, tokensUsed } = await analyzeIdea("测试想法");
    expect(modelUsed).toBe("mock-keyword");
    expect(tokensUsed).toBe(0);
  });
});
