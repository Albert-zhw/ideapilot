import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const navItems = [
    { href: "/admin", label: "概览" },
    { href: "/admin/users", label: "用户" },
    { href: "/admin/ideas", label: "想法" },
    { href: "/admin/templates", label: "模板" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">管理后台</span>
        </h1>
        <Link
          href="/workspace"
          className="text-sm opacity-60 hover:opacity-100 transition"
        >
          ← 返回工作台
        </Link>
      </div>

      <nav className="flex gap-1 mb-6 border-b border-white/10 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-sm opacity-70 hover:opacity-100 transition border-b-2 border-transparent hover:border-cyan-400 whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
