import { randomUUID } from "crypto";
import { Project, TranscriptParagraph } from "../domain/models";

// Phase 2: 단순 인메모리 저장소 (API 전용). STT/WS/비즈니스 로직 없음.
const projects: Project[] = [
  {
    id: randomUUID(),
    title: "데모 프로젝트 A",
    ownerId: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const paragraphs: TranscriptParagraph[] = [
  {
    id: randomUUID(),
    projectId: projects[0].id,
    order: 1,
    text: "안녕하세요, 데모 프로젝트입니다.",
    status: "FINALIZED",
    startedAt: new Date().toISOString(),
    finalizedAt: new Date().toISOString(),
  },
];

export const projectRepo = {
  list: (): Project[] => projects,
  get: (id: string): Project | undefined => projects.find((p) => p.id === id),
  create: (payload: { title: string; ownerId: string }): Project => {
    const now = new Date().toISOString();
    const project: Project = {
      id: randomUUID(),
      title: payload.title,
      ownerId: payload.ownerId,
      createdAt: now,
      updatedAt: now,
    };
    projects.unshift(project);
    return project;
  },
};

export const paragraphRepo = {
  listByProject: (projectId: string): TranscriptParagraph[] =>
    paragraphs
      .filter((p) => p.projectId === projectId)
      .sort((a, b) => a.order - b.order),
  findGenerating: (projectId: string): TranscriptParagraph | undefined =>
    paragraphs.find((p) => p.projectId === projectId && p.status === "GENERATING"),
  appendToGenerating: (projectId: string, textDelta: string): TranscriptParagraph => {
    const target = paragraphRepo.findGenerating(projectId);
    if (!target) {
      throw new Error("NO_GENERATING");
    }
    target.text = `${target.text} ${textDelta}`.trim();
    return target;
  },
  createGenerating: (projectId: string): TranscriptParagraph => {
    const existing = paragraphRepo.findGenerating(projectId);
    if (existing) {
      throw new Error("GENERATING_EXISTS");
    }
    const maxOrder =
      paragraphs
        .filter((p) => p.projectId === projectId)
        .reduce((max, p) => Math.max(max, p.order), 0) ?? 0;
    const now = new Date().toISOString();
    const paragraph: TranscriptParagraph = {
      id: randomUUID(),
      projectId,
      order: maxOrder + 1,
      text: "",
      status: "GENERATING",
      startedAt: now,
      finalizedAt: null,
    };
    paragraphs.push(paragraph);
    return paragraph;
  },
  finalizeGenerating: (projectId: string): TranscriptParagraph => {
    const target = paragraphRepo.findGenerating(projectId);
    if (!target) {
      throw new Error("NO_GENERATING");
    }
    target.status = "FINALIZED";
    target.finalizedAt = new Date().toISOString();
    return target;
  },
};

