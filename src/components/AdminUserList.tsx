"use client";

import { useState } from "react";
import { toggleUserRoleAction } from "@/actions/adminActions";
import type { Role } from "@prisma/client";

type User = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: Role;
  createdAt: Date;
};

export function AdminUserList({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  async function handleToggle() {
    setLoading(true);
    setToast("");
    const result = await toggleUserRoleAction(user.id, user.role);
    setLoading(false);
    if (result.error) {
      setToast(result.error);
    } else {
      setToast("角色已切换");
    }
    setTimeout(() => setToast(""), 2000);
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
      <td className="p-3">{user.name || "—"}</td>
      <td className="p-3 opacity-70 text-xs">{user.email}</td>
      <td className="p-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            isAdmin
              ? "bg-violet-500/20 text-violet-300"
              : "bg-white/10 text-gray-300"
          }`}
        >
          {isAdmin ? "管理员" : "用户"}
        </span>
      </td>
      <td className="p-3 opacity-60 text-xs">
        {new Date(user.createdAt).toLocaleDateString("zh-CN")}
      </td>
      <td className="p-3 text-right">
        <button
          onClick={handleToggle}
          disabled={loading}
          className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition text-xs disabled:opacity-50"
        >
          {loading ? "切换中…" : isAdmin ? "降为用户" : "升为管理员"}
        </button>
        {toast && (
          <span className="block mt-1 text-xs text-cyan-400">{toast}</span>
        )}
      </td>
    </tr>
  );
}
