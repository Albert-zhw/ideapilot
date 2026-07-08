import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { discussionService } from "@/services/discussionService";
import { getIdea } from "@/actions/ideaActions";
import { PromptViewer } from "@/components/PromptViewer";

export default async function DevelopmentPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const idea = await getIdea(id);
  if (!idea) redirect("/ideas");

  const prompt = await discussionService.getLatestDevelopmentPrompt(id, session.user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href={`/ideas/${id}`} className="text-sm opacity-60 hover:opacity-100 transition">
        ← 返回方案详情
      </Link>
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">TRAE 开发提示词</h1>
        <p className="text-sm opacity-60">复制这份提示词到 TRAE 新会话，即可开始代码实现。</p>
      </div>
      {prompt ? (
        <PromptViewer content={prompt.content} version={prompt.version} />
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="opacity-60 mb-4">还没有生成开发提示词。</p>
          <Link href={`/ideas/${id}`} className="gradient-btn rounded-lg px-5 py-2 inline-block">
            返回详情生成
          </Link>
        </div>
      )}
    </div>
  );
}
