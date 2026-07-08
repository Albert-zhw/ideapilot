"use client";

import { useState } from "react";
import { createTemplateAction } from "@/actions/adminActions";

export function AdminTemplateForm() {
  const [track, setTrack] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const result = await createTemplateAction({
      track: track.trim(),
      exampleInput: exampleInput.trim(),
      exampleOutput: exampleOutput.trim(),
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTrack("");
      setExampleInput("");
      setExampleOutput("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="block text-xs mb-1 opacity-70">赛道名</label>
          <input
            type="text"
            required
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            placeholder="如：社会服务"
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition text-sm"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-xs mb-1 opacity-70">示例输入</label>
          <input
            type="text"
            required
            value={exampleInput}
            onChange={(e) => setExampleInput(e.target.value)}
            placeholder="示例想法文本"
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition text-sm"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-xs mb-1 opacity-70">示例输出（JSON）</label>
          <input
            type="text"
            required
            value={exampleOutput}
            onChange={(e) => setExampleOutput(e.target.value)}
            placeholder='{"track":"...","mvp":[...]}'
            className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition text-sm font-mono"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {success && (
        <p className="text-cyan-400 text-xs">模板已创建</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg gradient-btn text-sm disabled:opacity-50"
      >
        {loading ? "创建中…" : "+ 新增模板"}
      </button>
    </form>
  );
}
