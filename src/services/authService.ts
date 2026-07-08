import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/userRepository";
import type { User } from "@prisma/client";

export const authService = {
  async register(email: string, password: string, name: string): Promise<User | null> {
    const exists = await userRepository.findByEmail(email);
    if (exists) return null;
    const passwordHash = await bcrypt.hash(password, 10);
    return userRepository.create({ email, passwordHash, name });
  },

  async verify(email: string, password: string): Promise<User | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  },

  async updateProfile(
    id: string,
    data: { name?: string; avatar?: string }
  ): Promise<User> {
    return userRepository.updateProfile(id, data);
  },
};
