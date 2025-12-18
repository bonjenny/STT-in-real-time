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
};

