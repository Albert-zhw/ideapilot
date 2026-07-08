"use server";

import { getSession } from "@/lib/auth";
import { userRepository } from "@/repositories/userRepository";
import { ideaService } from "@/services/ideaService";
import { templateRepository } from "@/repositories/templateRepository";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("请先登录");
  if (session.user.role !== "ADMIN") throw new Error("无权限访问");
  return session;
}

export async function toggleUserRoleAction(
  userId: string,
  currentRole: Role
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  const nextRole: Role = currentRole === "ADMIN" ? "USER" : "ADMIN";
  try {
    await userRepository.updateRole(userId, nextRole);
    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { error: "更新角色失败" };
  }
}

export async function deleteIdeaAdminAction(
  ideaId: string
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  try {
    await ideaService.deleteAdmin(ideaId);
    revalidatePath("/admin/ideas");
    return { success: true };
  } catch {
    return { error: "删除想法失败" };
  }
}

export async function createTemplateAction(input: {
  track: string;
  exampleInput: string;
  exampleOutput: string;
}): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  if (!input.track || !input.exampleInput || !input.exampleOutput) {
    return { error: "请填写所有字段" };
  }
  const exists = await templateRepository.findByTrack(input.track);
  if (exists) return { error: "赛道已存在" };
  try {
    await templateRepository.create(input);
    revalidatePath("/admin/templates");
    return { success: true };
  } catch {
    return { error: "创建模板失败" };
  }
}

export async function updateTemplateAction(input: {
  track: string;
  exampleInput: string;
  exampleOutput: string;
  isActive: boolean;
}): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  try {
    await templateRepository.update(input.track, {
      exampleInput: input.exampleInput,
      exampleOutput: input.exampleOutput,
      isActive: input.isActive,
    });
    revalidatePath("/admin/templates");
    return { success: true };
  } catch {
    return { error: "更新模板失败" };
  }
}

export async function deleteTemplateAction(
  track: string
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  try {
    await templateRepository.delete(track);
    revalidatePath("/admin/templates");
    return { success: true };
  } catch {
    return { error: "删除模板失败" };
  }
}

export async function toggleTemplateActiveAction(
  track: string,
  isActive: boolean
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  try {
    await templateRepository.update(track, { isActive: !isActive });
    revalidatePath("/admin/templates");
    return { success: true };
  } catch {
    return { error: "切换状态失败" };
  }
}
