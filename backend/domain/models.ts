// Phase 1: 엔티티 정의만 포함 (API/로직/WS 없음)
export type ParagraphStatus = "GENERATING" | "FINALIZED";

export type Project = {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type TranscriptParagraph = {
  id: string;
  projectId: string;
  order: number;
  text: string;
  status: ParagraphStatus;
  startedAt: string;
  finalizedAt: string | null;
};

