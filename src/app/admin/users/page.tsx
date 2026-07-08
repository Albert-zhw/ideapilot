import { userRepository } from "@/repositories/userRepository";
import { AdminUserList } from "@/components/AdminUserList";

export default async function AdminUsersPage() {
  const users = await userRepository.findAll();

  return (
    <div className="fade-in-up">
      <h2 className="text-lg font-bold mb-3 opacity-80">
        用户列表（共 {users.length} 人）
      </h2>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs opacity-60">
              <th className="text-left p-3 font-normal">昵称</th>
              <th className="text-left p-3 font-normal">邮箱</th>
              <th className="text-left p-3 font-normal">角色</th>
              <th className="text-left p-3 font-normal">注册时间</th>
              <th className="text-right p-3 font-normal">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <AdminUserList key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
