import type { AnalysisResult } from "@/types";

export function buildMarkdown(analysis: AnalysisResult): string {
  return `# ${analysis.title}

## 赛道判断
${analysis.track}

## 目标用户
${analysis.targetUser}

## 核心痛点
${analysis.painPoint}

## MVP 功能拆解
${analysis.mvp.map((f) => `- ${f}`).join("\n")}

## Demo 路线
${analysis.demoRoute}

## 任务清单
${analysis.tasks.map((t) => `- [ ] ${t}`).join("\n")}

## 电梯演讲
> ${analysis.pitch}

## 项目画布
| 用户 | 痛点 |
| --- | --- |
| ${analysis.canvas.user} | ${analysis.canvas.pain} |
| **方案** | **MVP** |
| ${analysis.canvas.solution} | ${analysis.canvas.mvp} |
| **差异化** | **下一步** |
| ${analysis.canvas.diff} | ${analysis.canvas.next} |

---
*由 IdeaPilot 生成*
`;
}
