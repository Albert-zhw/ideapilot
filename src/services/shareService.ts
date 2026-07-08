import { shareRepository } from "@/repositories/shareRepository";
import { randomUUID } from "crypto";

export const shareService = {
  async create(ideaId: string, userId: string) {
    const token = randomUUID().replace(/-/g, "");
    return shareRepository.create({ ideaId, userId, token });
  },

  async findByTokenAndIncrement(token: string) {
    const share = await shareRepository.findByToken(token);
    if (!share) return null;

    // 检查是否过期
    if (share.expiresAt && share.expiresAt < new Date()) {
      return null;
    }

    await shareRepository.incrementViewCount(token);
    return share;
  },

  async findByIdeaId(ideaId: string) {
    return shareRepository.findByIdeaId(ideaId);
  },
};
