"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { analyzeIdeaAction } from "@/actions/analysisActions";
import { AnalysisResultView } from "@/components/AnalysisResultView";
import { DiscussionPanel } from "@/components/DiscussionPanel";
import type { AnalysisResult } from "@/types";

const EXAMPLE_CHIPS = [
  "我想做个帮视障者导航最后 20 米的 App",
  "学生错题智能复习",
  "把会议录音直接变成行动清单",
  "帮独居老人每天打个招呼的智能音箱",
  "一个帮人坚持养成习惯的 App",
];

export function WorkspaceClient() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    analysis: AnalysisResult;
    source: "ai" | "mock";
    ideaId: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const loading = isPending;

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="opacity-50">加载中…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4">请先登录后使用工作台</p>
          <Link href="/login" className="gradient-btn px-6 py-2 rounded-lg inline-block">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  function handleAnalyze() {
    if (!input.trim()) {
      setError("请输入你的想法");
      return;
    }
    setError("");
    setResult(null);

    startTransition(async () => {
      try {
        const res = await analyzeIdeaAction(input);
        // 解析 JSON 字符串字段
        const parsed: AnalysisResult = {
          track: res.analysis.track,
          targetUser: res.analysis.targetUser,
          painPoint: res.analysis.painPoint,
          mvp: JSON.parse(res.analysis.mvp),
          demoRoute: res.analysis.demoRoute,
          tasks: JSON.parse(res.analysis.tasks),
          pitch: res.analysis.pitch,
          canvas: JSON.parse(res.analysis.canvas),
          title: res.analysis.title,
          tags: JSON.parse(res.analysis.tags),
        };
        setResult({
          analysis: parsed,
          source: res.source,
          ideaId: res.idea.id,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "分析失败，请重试");
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">AI 产品教练工作台</h1>
      <p className="text-sm opacity-60 mb-8">
        输入一句模糊想法，AI 帮你拆成赛道、用户、痛点、MVP、任务、画布。
      </p>

      {/* 输入区 */}
      <div className="glass rounded-2xl p-6 mb-8">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：我想做个帮视障者导航最后 20 米的 App"
          className="w-full h-24 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition resize-none"
          disabled={loading}
        />

        {/* 示例 chips */}
        <div className="mt-3">
          <div className="text-xs opacity-40 mb-2">试试这些：</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setInput(chip)}
                disabled={loading}
                className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="mt-4 w-full py-3 rounded-lg gradient-btn disabled:opacity-50 transition"
        >
          {loading ? "AI 正在分析你的想法…" : "开始分析"}
        </button>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin mb-4" />
          <p className="text-sm opacity-60">AI 正在拆解你的想法…</p>
        </div>
      )}

      {/* 分析结果 */}
      {result && !loading && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <AnalysisResultView analysis={result.analysis} source={result.source} />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/ideas/${result.ideaId}`}
                className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition text-sm"
              >
                查看详情 & 导出
              </Link>
              <button
                onClick={() => {
                  setResult(null);
                  setInput("");
                }}
                className="px-4 py-2 rounded-lg gradient-btn text-sm"
              >
                分析新想法
              </button>
            </div>
          </div>
          <DiscussionPanel ideaId={result.ideaId} />
        </div>
      )}
    </div>
  );
}
