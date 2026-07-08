"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { exportMarkdownAction, recordPdfExportAction } from "@/actions/exportActions";
import { createShare } from "@/actions/shareActions";
import { PdfDocument } from "@/components/PdfDocument";
import type { AnalysisResult } from "@/types";

export function IdeaDetailActions({
  ideaId,
  analysis,
}: {
  ideaId: string;
  analysis: {
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
  };
}) {
  const [toast, setToast] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState("");

  async function handleExportMarkdown() {
    setLoading("md");
    try {
      const md = await exportMarkdownAction(ideaId, analysis);
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${analysis.title || "方案"}.md`;
      a.click();
      URL.revokeObjectURL(url);
      setToast("已下载 Markdown 文件");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "导出失败");
    }
    setLoading("");
    setTimeout(() => setToast(""), 2000);
  }

  async function handleExportPdf() {
    setLoading("pdf");
    try {
      const parsed: AnalysisResult = {
        track: analysis.track,
        targetUser: analysis.targetUser,
        painPoint: analysis.painPoint,
        mvp: JSON.parse(analysis.mvp),
        demoRoute: analysis.demoRoute,
        tasks: JSON.parse(analysis.tasks),
        pitch: analysis.pitch,
        canvas: JSON.parse(analysis.canvas),
        title: analysis.title,
        tags: JSON.parse(analysis.tags),
      };
      const blob = await pdf(<PdfDocument analysis={parsed} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${analysis.title || "方案"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      await recordPdfExportAction(ideaId);
      setToast("已下载 PDF 文件");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "导出 PDF 失败");
    }
    setLoading("");
    setTimeout(() => setToast(""), 2000);
  }

  async function handleCopy() {
    setLoading("copy");
    const parsed: AnalysisResult = {
      track: analysis.track,
      targetUser: analysis.targetUser,
      painPoint: analysis.painPoint,
      mvp: JSON.parse(analysis.mvp),
      demoRoute: analysis.demoRoute,
      tasks: JSON.parse(analysis.tasks),
      pitch: analysis.pitch,
      canvas: JSON.parse(analysis.canvas),
      title: analysis.title,
      tags: JSON.parse(analysis.tags),
    };
    const text = formatAnalysisText(parsed);
    await navigator.clipboard.writeText(text);
    setToast("已复制到剪贴板");
    setLoading("");
    setTimeout(() => setToast(""), 2000);
  }

  async function handleShare() {
    setLoading("share");
    try {
      const share = await createShare(ideaId);
      const url = `${window.location.origin}/share/${share.token}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setToast("分享链接已复制");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "生成分享链接失败");
    }
    setLoading("");
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          disabled={!!loading}
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition text-sm disabled:opacity-50"
        >
          {loading === "copy" ? "复制中…" : "📋 复制方案"}
        </button>
        <button
          onClick={handleExportMarkdown}
          disabled={!!loading}
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition text-sm disabled:opacity-50"
        >
          {loading === "md" ? "导出中…" : "📄 下载 Markdown"}
        </button>
        <button
          onClick={handleExportPdf}
          disabled={!!loading}
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition text-sm disabled:opacity-50"
        >
          {loading === "pdf" ? "生成 PDF 中…" : "📕 下载 PDF"}
        </button>
        <button
          onClick={handleShare}
          disabled={!!loading}
          className="px-4 py-2 rounded-lg gradient-btn text-sm disabled:opacity-50"
        >
          {loading === "share" ? "生成中…" : "🔗 生成分享链接"}
        </button>
      </div>

      {shareUrl && (
        <div className="mt-3 p-3 rounded-lg bg-white/5 text-xs">
          <span className="opacity-50">分享链接：</span>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            {shareUrl}
          </a>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg gradient-btn text-sm fade-in-up z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function formatAnalysisText(a: AnalysisResult): string {
  return `# ${a.title}

赛道判断：${a.track}
目标用户：${a.targetUser}
核心痛点：${a.painPoint}

MVP 功能：
${a.mvp.map((f) => `- ${f}`).join("\n")}

Demo 路线：${a.demoRoute}

任务清单：
${a.tasks.map((t) => `- [ ] ${t}`).join("\n")}

电梯演讲：
${a.pitch}

项目画布：
- 用户：${a.canvas.user}
- 痛点：${a.canvas.pain}
- 方案：${a.canvas.solution}
- MVP：${a.canvas.mvp}
- 差异化：${a.canvas.diff}
- 下一步：${a.canvas.next}

---
由 IdeaPilot 生成`;
}
