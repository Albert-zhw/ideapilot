import Link from "next/link";
import { ideaService } from "@/services/ideaService";
import { AdminIdeaDeleteButton } from "@/components/AdminIdeaDeleteButton";

export default async function AdminIdeasPage() {
  const ideas = await ideaService.findAll();

  return (
    <div className="fade-in-up">
      <h2 className="text-lg font-bold mb-3 opacity-80">
        全部想法（共 {ideas.length} 条）
      </h2>

      {ideas.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="opacity-60">暂无想法</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs opacity-60">
                <th className="text-left p-3 font-normal">标题</th>
                <th className="text-left p-3 font-normal">用户</th>
                <th className="text-left p-3 font-normal">赛道</th>
                <th className="text-left p-3 font-normal">创建时间</th>
                <th className="text-right p-3 font-normal">操作</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr
                  key={idea.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition"
                >
                  <td className="p-3">
                    <Link
                      href={`/ideas/${idea.id}`}
                      className="hover:text-cyan-400 transition truncate block max-w-xs"
                    >
                      {idea.title || idea.rawText.slice(0, 20) + "…"}
                    </Link>
                  </td>
                  <td className="p-3 opacity-70 text-xs">
                    {idea.user?.name || idea.user?.email?.split("@")[0] || "—"}
                  </td>
                  <td className="p-3 opacity-70 text-xs">
                    {idea.analysis?.track?.split("（")[0] || "—"}
                  </td>
                  <td className="p-3 opacity-60 text-xs">
                    {new Date(idea.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="p-3 text-right">
                    <AdminIdeaDeleteButton ideaId={idea.id} title={idea.title || idea.rawText.slice(0, 20)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
