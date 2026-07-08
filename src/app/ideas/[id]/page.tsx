import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getIdea } from "@/actions/ideaActions";
import { analysisService } from "@/services/analysisService";
import { AnalysisResultView } from "@/components/AnalysisResultView";
import { IdeaDetailActions } from "@/components/IdeaDetailActions";
import { DiscussionPanel } from "@/components/DiscussionPanel";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const idea = await getIdea(id);
  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="opacity-60 mb-4">想法不存在或无权访问</p>
        <Link href="/ideas" className="text-cyan-400 hover:underline">
          返回想法库
        </Link>
      </div>
    );
  }

  if (!idea.analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="opacity-60 mb-4">该想法暂无分析结果</p>
        <Link href="/workspace" className="text-cyan-400 hover:underline">
          去工作台分析
        </Link>
      </div>
    );
  }

  const parsed = analysisService.parseAnalysis(idea.analysis);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/ideas"
          className="text-sm opacity-60 hover:opacity-100 transition"
        >
          ← 返回想法库
        </Link>
      </div>

      <div className="glass rounded-xl p-5 mb-6">
        <div className="text-xs opacity-50 mb-1">原始想法</div>
        <p className="text-sm">{idea.rawText}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <div className="mb-6">
            <AnalysisResultView analysis={parsed} />
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="font-bold mb-3">导出与分享</h3>
            <IdeaDetailActions ideaId={idea.id} analysis={idea.analysis} />
          </div>
        </div>
        <DiscussionPanel ideaId={idea.id} />
      </div>
    </div>
  );
}
