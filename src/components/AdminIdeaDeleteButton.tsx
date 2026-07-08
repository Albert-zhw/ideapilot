"use client";

import { useState } from "react";
import { deleteIdeaAdminAction } from "@/actions/adminActions";

export function AdminIdeaDeleteButton({
  ideaId,
  title,
}: {
  ideaId: string;
  title: string;
}) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteIdeaAdminAction(ideaId);
    setLoading(false);
    setConfirming(false);
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-3 py-1 rounded-lg border border-red-500/30 text-red-400 hover:border-red-500/60 transition text-xs"
      >
        删除
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs opacity-70">确认删除「{title}」？</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-2 py-1 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50 transition text-xs disabled:opacity-50"
      >
        {loading ? "删除中…" : "确认"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={loading}
        className="px-2 py-1 rounded-lg border border-white/20 text-xs disabled:opacity-50"
      >
        取消
      </button>
    </span>
  );
}
