"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/actions/authActions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await registerAction(email, password, name);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // 注册成功，自动登录
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (signInResult?.error) {
      setError("注册成功，但自动登录失败，请手动登录");
    } else {
      router.push("/workspace");
      router.refresh();
    }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 fade-in-up">
        <h1 className="text-2xl font-bold mb-2">注册 IdeaPilot</h1>
        <p className="text-sm opacity-60 mb-6">一句话想法，一份可执行方案。</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 opacity-80">昵称</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 focus:border-cyan-400 focus:outline-none transition"
              placeholder="你的昵称"
            />
          </div>
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
              placeholder="至少 6 位"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg gradient-btn disabled:opacity-50 transition"
          >
            {loading ? "注册中…" : "注册"}
          </button>
        </form>

        <p className="text-sm mt-6 opacity-60">
          已有账号？<Link href="/login" className="text-cyan-400 hover:underline">登录</Link>
        </p>
      </div>
    </main>
  );
}
