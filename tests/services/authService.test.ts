import { describe, it, expect } from "vitest";
import { authService } from "@/services/authService";

describe("authService（使用种子数据）", () => {
  it("应该能验证种子 demo 用户", async () => {
    const user = await authService.verify("demo@ideapilot.app", "user123456");
    expect(user).not.toBeNull();
    expect(user!.email).toBe("demo@ideapilot.app");
  });

  it("错误密码应返回 null", async () => {
    const user = await authService.verify("demo@ideapilot.app", "wrongpassword");
    expect(user).toBeNull();
  });

  it("不存在的邮箱应返回 null", async () => {
    const user = await authService.verify("nobody@ideapilot.app", "user123456");
    expect(user).toBeNull();
  });

  it("应该能验证管理员账号", async () => {
    const user = await authService.verify("admin@ideapilot.app", "admin123456");
    expect(user).not.toBeNull();
    expect(user!.role).toBe("ADMIN");
  });

  it("注册已存在邮箱应返回 null", async () => {
    const user = await authService.register(
      "demo@ideapilot.app",
      "newpassword",
      "重复用户"
    );
    expect(user).toBeNull();
  });
});
