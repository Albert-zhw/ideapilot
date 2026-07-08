"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="gradient-text">IdeaPilot</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {status === "loading" ? (
            <span className="opacity-50">加载中…</span>
          ) : session ? (
            <>
              <Link href="/workspace" className="hover:text-cyan-400 transition">
                工作台
              </Link>
              <Link href="/ideas" className="hover:text-cyan-400 transition">
                我的想法
              </Link>
              <Link href="/history" className="hover:text-cyan-400 transition">
                历史
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-cyan-400 transition">
                  后台
                </Link>
              )}
              <span className="opacity-60">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs px-3 py-1 rounded border border-white/20 hover:border-white/40 transition"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-cyan-400 transition">
                登录
              </Link>
              <Link
                href="/register"
                className="gradient-btn px-3 py-1 rounded text-xs"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
