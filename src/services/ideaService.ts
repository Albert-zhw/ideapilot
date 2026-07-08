import { ideaRepository } from "@/repositories/ideaRepository";
import type { Idea } from "@prisma/client";

export const ideaService = {
  async create(rawText: string, userId: string): Promise<Idea> {
    return ideaRepository.create({ userId, rawText });
  },

  async findById(id: string, userId: string) {
    const idea = await ideaRepository.findById(id);
    if (!idea || idea.userId !== userId) return null;
    return idea;
  },

  async findByIdAdmin(id: string) {
    return ideaRepository.findById(id);
  },

  async findByUserId(userId: string) {
    return ideaRepository.findByUserId(userId);
  },

  async findAll() {
    return ideaRepository.findAll();
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await ideaRepository.delete(id, userId);
    return result.count > 0;
  },

  async deleteAdmin(id: string): Promise<void> {
    await ideaRepository.deleteById(id);
  },

  async updateTitle(id: string, title: string) {
    return ideaRepository.updateTitle(id, title);
  },

  async getStats(userId: string) {
    const ideas = await ideaRepository.findByUserId(userId);
    return {
      totalIdeas: ideas.length,
      analyzedIdeas: ideas.filter((i) => i.analysis).length,
    };
  },
};
