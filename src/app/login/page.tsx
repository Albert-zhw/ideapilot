"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/workspace");
      router.refresh();
    }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 fade-in-up">
        <h1 className="text-2xl font-bold mb-2">登录 IdeaPilot</h1>
        <p className="text-sm opacity-60 mb-6">登录后进入工作台，把想法变成方案。</p>

        <div className="mb-4 p-3 rounded-lg bg-white/5 text-xs opacity-70">
          <p>体验账号：demo@ideapilot.app / user123456</p>
          <p>管理员：admin@ideapilot.app / admin123456</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 opacity-80">邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 opacity-80">密码</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg gradient-btn disabled:opacity-50 transition"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>

        <p className="text-sm mt-6 opacity-60">
          还没有账号？<Link href="/register" className="text-cyan-400 hover:underline">注册</Link>
        </p>
      </div>
    </main>
  );
}
