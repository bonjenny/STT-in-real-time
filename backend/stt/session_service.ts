import { randomUUID } from "crypto";
import { paragraphRepo, projectRepo } from "../repo/memory";
import { SttEngine, SttEngineSession } from "./engine";
import { TranscriptParagraph } from "../domain/models";

// PHASE B/C: 스트리밍 파이프라인 스켈레톤 (오디오 변환 없음, STT 더미)
// - Partial: 메모리 상태만 갱신 (DB 미반영)
// - Final: GENERATING 단락에 누적 후 FINALIZED + 새 GENERATING 생성

type SessionState = {
  sessionId: string;
  projectId: string;
  engineSession: SttEngineSession;
  generatingParagraphId: string;
  partialText: string;
};

const sessions = new Map<string, SessionState>();
const sessionByProject = new Map<string, string>();

const getSessionByProject = (projectId: string): SessionState | undefined => {
  const sid = sessionByProject.get(projectId);
  return sid ? sessions.get(sid) : undefined;
};

export function startSttSession(projectId: string, engine: SttEngine): SessionState {
  const project = projectRepo.get(projectId);
  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }
  if (getSessionByProject(projectId)) {
    throw new Error("SESSION_EXISTS");
  }

  // GENERATING 단락 확보 (없으면 새로 생성)
  let generating = paragraphRepo.findGenerating(projectId);
  if (!generating) {
    generating = paragraphRepo.createGenerating(projectId);
  }

  const engineSession = engine.startSession({ language: "auto" });
  const state: SessionState = {
    sessionId: randomUUID(),
    projectId,
    engineSession,
    generatingParagraphId: generating.id,
    partialText: "",
  };
  sessions.set(state.sessionId, state);
  sessionByProject.set(projectId, state.sessionId);

  attachEngineCallbacks(state);
  return state;
}

export function stopSttSession(sessionId: string): TranscriptParagraph | null {
  const state = sessions.get(sessionId);
  if (!state) return null;
  state.engineSession.close();
  sessions.delete(sessionId);
  sessionByProject.delete(state.projectId);
  // GENERATING 있으면 FINALIZED 처리
  return paragraphRepo.finalizeIfExists(state.projectId);
}

export function handleAudioChunk(sessionId: string, chunk: Buffer) {
  const state = sessions.get(sessionId);
  if (!state) throw new Error("SESSION_NOT_FOUND");
  state.engineSession.sendAudio(chunk); // 변환 없이 그대로 전달
}

export function getSnapshot(projectId: string): TranscriptParagraph[] {
  const session = getSessionByProject(projectId);
  const paragraphs = paragraphRepo.listByProject(projectId);
  if (!session) return paragraphs;
  // 메모리 partial을 GENERATING 단락에 오버레이
  return paragraphs.map((p) =>
    p.id === session.generatingParagraphId && session.partialText
      ? { ...p, text: session.partialText }
      : p,
  );
}

function attachEngineCallbacks(state: SessionState) {
  state.engineSession.onPartialResult((text) => {
    // partial은 메모리 상태에만 반영
    state.partialText = text;
  });

  state.engineSession.onFinalResult((text) => {
    // 최종 텍스트를 GENERATING 단락에 누적 후 FINALIZE + 새 GENERATING
    paragraphRepo.appendToGenerating(state.projectId, text);
    const { next } = paragraphRepo.finalizeAndCreateNext(state.projectId);
    state.generatingParagraphId = next.id;
    state.partialText = "";
  });
}

