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
  lastAudioAt: number;
};

const sessions = new Map<string, SessionState>();
const sessionByProject = new Map<string, string>();

const getSessionByProject = (projectId: string): SessionState | undefined => {
  const sid = sessionByProject.get(projectId);
  return sid ? sessions.get(sid) : undefined;
};

export function getSessionIdByProject(projectId: string): string | null {
  const sid = sessionByProject.get(projectId);
  return sid ?? null;
}

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
    lastAudioAt: Date.now(),
  };
  sessions.set(state.sessionId, state);
  sessionByProject.set(projectId, state.sessionId);

  attachEngineCallbacks(state);
  return state;
}

export function stopSttSession(sessionId: string): TranscriptParagraph | null {
  return endSession(sessionId, true);
}

export function handleAudioChunk(sessionId: string, chunk: Buffer) {
  const state = sessions.get(sessionId);
  if (!state) throw new Error("SESSION_NOT_FOUND");
  state.lastAudioAt = Date.now();
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

// PHASE D: 문단 확정 트리거 (무음/글자수/명시적 종료/Final 이벤트 중 하나 충족 시)

const SILENCE_MS = 1200;
const MAX_CHAR_THRESHOLD = 400;

export function shouldFinalizeBySilence(sessionId: string): boolean {
  const state = sessions.get(sessionId);
  if (!state) throw new Error("SESSION_NOT_FOUND");
  return Date.now() - state.lastAudioAt >= SILENCE_MS;
}

export function shouldFinalizeByLength(sessionId: string): boolean {
  const state = sessions.get(sessionId);
  if (!state) throw new Error("SESSION_NOT_FOUND");
  return state.partialText.length >= MAX_CHAR_THRESHOLD;
}

export function forceFinalize(sessionId: string) {
  const state = sessions.get(sessionId);
  if (!state) throw new Error("SESSION_NOT_FOUND");
  paragraphRepo.appendToGenerating(state.projectId, state.partialText);
  const { next } = paragraphRepo.finalizeAndCreateNext(state.projectId);
  state.generatingParagraphId = next.id;
  state.partialText = "";
  state.lastAudioAt = Date.now();
}

// PHASE F: 오류/종료 복구 훅
export function handleEngineFailure(sessionId: string): TranscriptParagraph | null {
  return endSession(sessionId, true);
}

export function handleClientDisconnect(sessionId: string): TranscriptParagraph | null {
  return endSession(sessionId, true);
}

export function stopSessionByProject(projectId: string): TranscriptParagraph | null {
  const sid = sessionByProject.get(projectId);
  if (!sid) return null;
  return endSession(sid, true);
}

function endSession(sessionId: string, finalizeGenerating: boolean): TranscriptParagraph | null {
  const state = sessions.get(sessionId);
  if (!state) return null;
  state.engineSession.close();
  sessions.delete(sessionId);
  sessionByProject.delete(state.projectId);
  if (!finalizeGenerating) return null;
  return paragraphRepo.finalizeIfExists(state.projectId);
}

