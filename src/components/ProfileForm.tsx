"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/actions/authActions";

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const result = await updateProfileAction(name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1 opacity-80">昵称</label>
        <input
          type="text"
          required
          maxLength={20}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuccess(false);
            setError("");
          }}
          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition"
          placeholder="给自己起个昵称"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && (
        <p className="text-cyan-400 text-sm">已保存</p>
      )}
      <button
        type="submit"
        disabled={loading || name.trim() === initialName}
        className="px-4 py-2 rounded-lg gradient-btn disabled:opacity-50 transition text-sm"
      >
        {loading ? "保存中…" : "保存昵称"}
      </button>
    </form>
  );
}
