import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMyIdeas } from "@/actions/ideaActions";

export default async function IdeasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const ideas = await getMyIdeas();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的想法库</h1>
        <Link
          href="/workspace"
          className="gradient-btn px-4 py-2 rounded-lg text-sm"
        >
          + 分析新想法
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="opacity-60 mb-4">还没有想法，去工作台输入第一个吧</p>
          <Link
            href="/workspace"
            className="gradient-btn px-6 py-2 rounded-lg inline-block"
          >
            进入工作台
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <Link
              key={idea.id}
              href={`/ideas/${idea.id}`}
              className="block glass rounded-xl p-5 hover:border-cyan-400/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1 truncate">
                    {idea.title || idea.rawText.slice(0, 20) + "…"}
                  </h3>
                  <p className="text-sm opacity-50 line-clamp-2 mb-2">
                    {idea.rawText}
                  </p>
                  <div className="flex items-center gap-3 text-xs opacity-40">
                    {idea.analysis && (
                      <span>{idea.analysis.track.split("·")[0]}</span>
                    )}
                    <span>
                      {new Date(idea.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </div>
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {idea.tags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 rounded-full text-xs border"
                        style={{ borderColor: tag.color + "60" }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
