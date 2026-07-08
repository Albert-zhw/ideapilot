// IdeaPilot 类型定义

export interface AnalysisCanvas {
  user: string;
  pain: string;
  solution: string;
  mvp: string;
  diff: string;
  next: string;
}

export interface AnalysisResult {
  track: string;
  targetUser: string;
  painPoint: string;
  mvp: string[];
  demoRoute: string;
  tasks: string[];
  pitch: string;
  canvas: AnalysisCanvas;
  title: string;
  tags: string[];
}

export interface AnalyzeResponse {
  result: AnalysisResult;
  modelUsed: string;
  tokensUsed: number;
  source: "ai" | "mock";
}

export interface IdeaWithAnalysis {
  id: string;
  userId: string;
  rawText: string;
  title: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  analysis: AnalysisResultRow | null;
  tags: { tag: { id: string; name: string; color: string } }[];
}

export interface AnalysisResultRow {
  id: string;
  ideaId: string;
  track: string;
  targetUser: string;
  painPoint: string;
  mvp: string;
  demoRoute: string;
  tasks: string;
  pitch: string;
  canvas: string;
  title: string;
  tags: string;
  modelUsed: string;
  tokensUsed: number;
  createdAt: Date;
}
