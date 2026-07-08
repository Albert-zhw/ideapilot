"use client";

import type { AnalysisResult } from "@/types";

export function AnalysisResultView({
  analysis,
  source,
}: {
  analysis: AnalysisResult;
  source?: "ai" | "mock";
}) {
  return (
    <div className="space-y-6 fade-in-up">
      {/* 来源标记 */}
      {source && (
        <div className="text-xs">
          <span
            className={`px-2 py-1 rounded ${
              source === "ai"
                ? "bg-cyan-400/20 text-cyan-300"
                : "bg-white/10 text-white/60"
            }`}
          >
            {source === "ai" ? "✨ AI 语义分析" : "📝 关键词匹配（本地模拟）"}
          </span>
        </div>
      )}

      {/* 六维方案 */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 gradient-text">{analysis.title}</h3>

        <div className="space-y-4">
          <Dimension label="赛道判断" icon="🎯" value={analysis.track} />
          <Dimension label="目标用户" icon="👤" value={analysis.targetUser} />
          <Dimension label="核心痛点" icon="💥" value={analysis.painPoint} />
          <Dimension label="Demo 路线" icon="🗺️" value={analysis.demoRoute} />
        </div>
      </div>

      {/* MVP 功能 */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <span>📦</span> MVP 功能拆解
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {analysis.mvp.map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm"
            >
              <span className="text-cyan-400 mr-2">{i + 1}.</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* 任务清单 */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <span>📋</span> 任务清单（可立即动手）
        </h4>
        <div className="space-y-2">
          {analysis.tasks.map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-violet-400 mt-0.5">☐</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 电梯演讲 */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <span>🎤</span> 30 秒电梯演讲
        </h4>
        <p className="text-sm leading-relaxed opacity-90 italic">
          &ldquo;{analysis.pitch}&rdquo;
        </p>
      </div>

      {/* 项目画布 */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span>🖼️</span> 项目画布
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <CanvasCell label="用户" value={analysis.canvas.user} />
          <CanvasCell label="痛点" value={analysis.canvas.pain} />
          <CanvasCell label="方案" value={analysis.canvas.solution} />
          <CanvasCell label="MVP" value={analysis.canvas.mvp} />
          <CanvasCell label="差异化" value={analysis.canvas.diff} />
          <CanvasCell label="下一步" value={analysis.canvas.next} />
        </div>
      </div>

      {/* 标签 */}
      {analysis.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {analysis.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Dimension({
  label,
  icon,
  value,
}: {
  label: string;
  icon: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs opacity-50 mb-1">
        {icon} {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function CanvasCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="text-xs opacity-50 mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
