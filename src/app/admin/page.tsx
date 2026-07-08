import Link from "next/link";
import { adminService } from "@/services/adminService";

export default async function AdminOverviewPage() {
  const [stats, tagDistribution, recentIdeas, recentShares] = await Promise.all([
    adminService.getStats(),
    adminService.getTagDistribution(),
    adminService.getRecentIdeas(10),
    adminService.getRecentShares(10),
  ]);

  const statCards = [
    { label: "用户", value: stats.userCount, color: "text-cyan-400" },
    { label: "想法", value: stats.ideaCount, color: "text-blue-400" },
    { label: "分析方案", value: stats.analysisCount, color: "text-violet-400" },
    { label: "分享链接", value: stats.shareCount, color: "text-pink-400" },
    { label: "导出记录", value: stats.exportCount, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6 fade-in-up">
      <section>
        <h2 className="text-lg font-bold mb-3 opacity-80">数据概览</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
          {statCards.map((card) => (
            <div key={card.label} className="glass rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <div className="text-xs opacity-60 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 opacity-80">标签分布</h2>
        <div className="glass rounded-xl p-4">
          {tagDistribution.length === 0 ? (
            <p className="text-sm opacity-50 text-center py-4">暂无标签</p>
          ) : (
            <div className="space-y-2">
              {tagDistribution.map((tag) => {
                const max = Math.max(...tagDistribution.map((t) => t.count), 1);
                const width = `${(tag.count / max) * 100}%`;
                return (
                  <div key={tag.name} className="flex items-center gap-3">
                    <span
                      className="text-xs w-20 shrink-0"
                      style={{ color: tag.color }}
                    >
                      {tag.name}
                    </span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width,
                          backgroundColor: tag.color,
                        }}
                      />
                    </div>
                    <span className="text-xs opacity-60 w-8 text-right">
                      {tag.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-bold mb-3 opacity-80">最近想法</h2>
          <div className="glass rounded-xl p-4 space-y-2">
            {recentIdeas.length === 0 ? (
              <p className="text-sm opacity-50 text-center py-4">暂无数据</p>
            ) : (
              recentIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/ideas/${idea.id}`}
                  className="block py-2 px-2 rounded-lg hover:bg-white/5 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm truncate flex-1">
                      {idea.title || idea.rawText.slice(0, 20) + "…"}
                    </span>
                    <span className="text-xs opacity-40 shrink-0">
                      {idea.user?.name || idea.user?.email?.split("@")[0]}
                    </span>
                  </div>
                  <div className="text-xs opacity-40">
                    {new Date(idea.createdAt).toLocaleString("zh-CN")}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 opacity-80">最近分享</h2>
          <div className="glass rounded-xl p-4 space-y-2">
            {recentShares.length === 0 ? (
              <p className="text-sm opacity-50 text-center py-4">暂无数据</p>
            ) : (
              recentShares.map((share) => (
                <div
                  key={share.id}
                  className="py-2 px-2 rounded-lg flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm truncate">
                      {share.idea?.title || "（已删除）"}
                    </div>
                    <div className="text-xs opacity-40">
                      分享者：{share.user?.name || "未知"} · 访问{" "}
                      {share.viewCount} 次
                    </div>
                  </div>
                  <Link
                    href={`/share/${share.token}`}
                    target="_blank"
                    className="text-xs text-cyan-400 hover:underline shrink-0"
                  >
                    查看
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
