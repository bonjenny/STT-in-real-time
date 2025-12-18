// PHASE A: STT 엔진 추상화 (외부 API 호출 없음, 인터페이스 정의만)

export type PartialResultHandler = (text: string) => void;
export type FinalResultHandler = (text: string) => void;

export interface SttEngineSession {
  sendAudio(chunk: Buffer): void;
  onPartialResult(cb: PartialResultHandler): void;
  onFinalResult(cb: FinalResultHandler): void;
  close(): void;
}

export interface SttEngine {
  startSession(config: { language?: string }): SttEngineSession;
}

