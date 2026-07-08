"use server";

import { authService } from "@/services/authService";
import { getSession } from "@/lib/auth";

export async function registerAction(
  email: string,
  password: string,
  name: string
): Promise<{ error?: string; success?: boolean }> {
  if (!email || !password || !name) {
    return { error: "请填写所有字段" };
  }
  if (password.length < 6) {
    return { error: "密码至少 6 位" };
  }
  const user = await authService.register(email, password, name);
  if (!user) {
    return { error: "邮箱已注册" };
  }
  return { success: true };
}

export async function updateProfileAction(
  name: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession();
  if (!session) {
    return { error: "请先登录" };
  }
  if (!name || name.trim().length === 0) {
    return { error: "昵称不能为空" };
  }
  if (name.length > 20) {
    return { error: "昵称最多 20 个字符" };
  }
  await authService.updateProfile(session.user.id, { name: name.trim() });
  return { success: true };
}
