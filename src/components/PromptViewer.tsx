"use client";

import { useState } from "react";

export function PromptViewer({ content, version }: { content: string; version: number }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
  }

  function download() {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trae-development-prompt-v${version}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs opacity-45">版本</div>
          <div className="font-bold">V{version}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="px-4 py-2 rounded-lg gradient-btn text-sm">
            {copied ? "已复制" : "复制提示词"}
          </button>
          <button onClick={download} className="px-4 py-2 rounded-lg border border-white/15 hover:border-white/35 text-sm">
            下载 Markdown
          </button>
        </div>
      </div>
      <pre className="max-h-[70vh] overflow-auto rounded-xl bg-black/30 border border-white/10 p-4 text-sm whitespace-pre-wrap leading-relaxed">
        {content}
      </pre>
    </div>
  );
}
