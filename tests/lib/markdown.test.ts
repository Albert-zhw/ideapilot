import { describe, it, expect } from "vitest";
import { buildMarkdown } from "@/lib/export/markdown";
import type { AnalysisResult } from "@/types";

const mockAnalysis: AnalysisResult = {
  track: "测试赛道",
  targetUser: "测试用户",
  painPoint: "测试痛点",
  mvp: ["功能1", "功能2", "功能3", "功能4"],
  demoRoute: "测试路线",
  tasks: ["任务1", "任务2", "任务3", "任务4"],
  pitch: "测试演讲",
  canvas: {
    user: "用户",
    pain: "痛点",
    solution: "方案",
    mvp: "MVP",
    diff: "差异化",
    next: "下一步",
  },
  title: "测试标题",
  tags: ["测试标签"],
};

describe("buildMarkdown", () => {
  it("应包含标题", () => {
    const md = buildMarkdown(mockAnalysis);
    expect(md).toContain("# 测试标题");
  });

  it("应包含六维方案的所有维度", () => {
    const md = buildMarkdown(mockAnalysis);
    expect(md).toContain("赛道判断");
    expect(md).toContain("目标用户");
    expect(md).toContain("核心痛点");
    expect(md).toContain("MVP 功能拆解");
    expect(md).toContain("Demo 路线");
    expect(md).toContain("任务清单");
    expect(md).toContain("电梯演讲");
    expect(md).toContain("项目画布");
  });

  it("MVP 和任务应渲染为列表", () => {
    const md = buildMarkdown(mockAnalysis);
    expect(md).toContain("- 功能1");
    expect(md).toContain("- [ ] 任务1");
  });

  it("画布应渲染为表格", () => {
    const md = buildMarkdown(mockAnalysis);
    expect(md).toContain("| 用户 | 痛点 |");
    expect(md).toContain("| 方案 | MVP |");
  });

  it("应包含 IdeaPilot 签名", () => {
    const md = buildMarkdown(mockAnalysis);
    expect(md).toContain("IdeaPilot");
  });
});
