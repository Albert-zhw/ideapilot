import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userRepository } from "@/repositories/userRepository";
import { ideaService } from "@/services/ideaService";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await userRepository.findById(session.user.id);
  if (!user) redirect("/login");

  const stats = await ideaService.getStats(user.id);
  const role = user.role === "ADMIN" ? "管理员" : "普通用户";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>

      <div className="grid gap-4 mb-6 sm:grid-cols-3">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {stats.totalIdeas}
          </div>
          <div className="text-xs opacity-60 mt-1">想法总数</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {stats.analyzedIdeas}
          </div>
          <div className="text-xs opacity-60 mt-1">已生成方案</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-sm font-bold gradient-text">{role}</div>
          <div className="text-xs opacity-60 mt-1">账号角色</div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 fade-in-up">
        <h2 className="font-bold mb-4">账号信息</h2>
        <div className="space-y-2 text-sm mb-6 opacity-80">
          <div>
            <span className="opacity-60 inline-block w-16">邮箱</span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="opacity-60 inline-block w-16">注册时间</span>
            <span>{new Date(user.createdAt).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>

        <h2 className="font-bold mb-4 pt-4 border-t border-white/10">
          修改昵称
        </h2>
        <ProfileForm initialName={user.name ?? ""} />
      </div>
    </div>
  );
}
