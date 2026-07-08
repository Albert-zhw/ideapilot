import Link from "next/link";
import { notFound } from "next/navigation";
import { getShareByToken } from "@/actions/shareActions";
import { analysisService } from "@/services/analysisService";
import { AnalysisResultView } from "@/components/AnalysisResultView";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await getShareByToken(token);

  if (!share || !share.idea.analysis) {
    notFound();
  }

  const parsed = analysisService.parseAnalysis(share.idea.analysis);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass rounded-xl p-5 mb-6 text-center">
        <p className="text-sm opacity-60">
          这份方案由 {share.idea.user?.name || "匿名用户"} 通过 IdeaPilot 生成并分享
        </p>
        <p className="text-xs opacity-40 mt-1">
          已被查看 {share.viewCount} 次
        </p>
      </div>

      <div className="mb-6">
        <AnalysisResultView analysis={parsed} />
      </div>

      <div className="glass rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold mb-2">
          想把你的想法也变成方案？
        </h3>
        <p className="opacity-60 mb-4">
          用 IdeaPilot，30 秒拿到一份结构化方案。
        </p>
        <Link
          href="/workspace"
          className="inline-block gradient-btn px-6 py-2 rounded-lg"
        >
          免费试试
        </Link>
      </div>
    </div>
  );
}
