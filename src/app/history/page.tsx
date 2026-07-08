import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMyIdeas } from "@/actions/ideaActions";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const ideas = await getMyIdeas();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">历史记录</h1>

      {ideas.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="opacity-60 mb-4">还没有分析记录</p>
          <Link
            href="/workspace"
            className="gradient-btn px-6 py-2 rounded-lg inline-block"
          >
            去工作台
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <Link
              key={idea.id}
              href={`/ideas/${idea.id}`}
              className="block glass rounded-xl p-4 hover:border-cyan-400/30 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {idea.title || idea.rawText.slice(0, 30) + "…"}
                  </h3>
                  {idea.analysis && (
                    <p className="text-xs opacity-50 mt-1">
                      {idea.analysis.track}
                    </p>
                  )}
                </div>
                <div className="text-xs opacity-40 whitespace-nowrap">
                  {new Date(idea.createdAt).toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
