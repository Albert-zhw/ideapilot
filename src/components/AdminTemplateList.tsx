"use client";

import { useState } from "react";
import {
  updateTemplateAction,
  deleteTemplateAction,
  toggleTemplateActiveAction,
} from "@/actions/adminActions";

type Template = {
  id: string;
  track: string;
  exampleInput: string;
  exampleOutput: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function AdminTemplateList({ template }: { template: Template }) {
  const [editing, setEditing] = useState(false);
  const [exampleInput, setExampleInput] = useState(template.exampleInput);
  const [exampleOutput, setExampleOutput] = useState(template.exampleOutput);
  const [loading, setLoading] = useState("");
  const [toast, setToast] = useState("");

  async function handleSave() {
    setLoading("save");
    setToast("");
    const result = await updateTemplateAction({
      track: template.track,
      exampleInput,
      exampleOutput,
      isActive: template.isActive,
    });
    setLoading("");
    if (result.error) {
      setToast(result.error);
    } else {
      setToast("已保存");
      setEditing(false);
    }
    setTimeout(() => setToast(""), 2000);
  }

  async function handleToggleActive() {
    setLoading("toggle");
    const result = await toggleTemplateActiveAction(
      template.track,
      template.isActive
    );
    setLoading("");
    setToast(result.error || (template.isActive ? "已停用" : "已启用"));
    setTimeout(() => setToast(""), 2000);
  }

  async function handleDelete() {
    setLoading("delete");
    const result = await deleteTemplateAction(template.track);
    setLoading("");
    setToast(result.error || "已删除");
    setTimeout(() => setToast(""), 2000);
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{template.track}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              template.isActive
                ? "bg-green-500/20 text-green-300"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {template.isActive ? "启用" : "停用"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleActive}
            disabled={!!loading}
            className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition text-xs disabled:opacity-50"
          >
            {loading === "toggle" ? "…" : template.isActive ? "停用" : "启用"}
          </button>
          <button
            onClick={() => setEditing((v) => !v)}
            disabled={!!loading}
            className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition text-xs disabled:opacity-50"
          >
            {editing ? "收起" : "编辑"}
          </button>
          <button
            onClick={handleDelete}
            disabled={!!loading}
            className="px-3 py-1 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition text-xs disabled:opacity-50"
          >
            {loading === "delete" ? "删除中…" : "删除"}
          </button>
        </div>
      </div>

      {!editing ? (
        <div className="text-xs opacity-60 space-y-1">
          <div>
            <span className="opacity-50">示例输入：</span>
            {template.exampleInput}
          </div>
          <div className="font-mono break-all">
            <span className="opacity-50">示例输出：</span>
            {template.exampleOutput.slice(0, 200)}
            {template.exampleOutput.length > 200 ? "…" : ""}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="block text-xs mb-1 opacity-70">示例输入</label>
            <textarea
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 opacity-70">
              示例输出（JSON）
            </label>
            <textarea
              value={exampleOutput}
              onChange={(e) => setExampleOutput(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition text-xs font-mono"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!!loading}
            className="px-4 py-1.5 rounded-lg gradient-btn text-xs disabled:opacity-50"
          >
            {loading === "save" ? "保存中…" : "保存修改"}
          </button>
        </div>
      )}

      {toast && (
        <div className="mt-2 text-xs text-cyan-400">{toast}</div>
      )}
    </div>
  );
}
