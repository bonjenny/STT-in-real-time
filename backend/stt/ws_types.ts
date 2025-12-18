// WebSocket 메시지 타입/페이로드 정의 (핸들러/로직 없음)
import { ParagraphStatus } from "../domain/models";

export enum WsMessageType {
  STT_SESSION_START = "STT_SESSION_START",
  STT_SESSION_STARTED = "STT_SESSION_STARTED",
  STT_SESSION_STOP = "STT_SESSION_STOP",
  STT_SESSION_STOPPED = "STT_SESSION_STOPPED",
  AUDIO_CHUNK = "AUDIO_CHUNK",
  STT_PARTIAL_RESULT = "STT_PARTIAL_RESULT",
  STT_FINAL_RESULT = "STT_FINAL_RESULT",
  PARAGRAPH_CREATED = "PARAGRAPH_CREATED",
  PARAGRAPH_UPDATE = "PARAGRAPH_UPDATE",
  PARAGRAPH_UPDATED = "PARAGRAPH_UPDATED",
  STATE_SYNC = "STATE_SYNC",
  ERROR = "ERROR",
}

export enum WsErrorCode {
  INVALID_STATE = "INVALID_STATE",
  SESSION_EXISTS = "SESSION_EXISTS",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export type WsEnvelope<TPayload> = {
  type: WsMessageType;
  payload: TPayload;
  timestamp: number; // ms epoch
};

// ---- Payload Types ----

export type SttSessionStartPayload = {
  projectId: string;
  language?: string;
};

export type SttSessionStartedPayload = {
  paragraphId: string;
};

export type SttSessionStopPayload = Record<string, never>;

export type SttSessionStoppedPayload = {
  finalizedParagraphId: string | null;
};

export type AudioChunkPayload = {
  data: ArrayBuffer | Buffer;
};

export type SttPartialResultPayload = {
  paragraphId: string;
  text: string;
};

export type SttFinalResultPayload = {
  paragraphId: string;
  text: string;
};

export type ParagraphCreatedPayload = {
  paragraphId: string;
  status: Extract<ParagraphStatus, "GENERATING" | "FINALIZED">;
};

export type ParagraphUpdatePayload = {
  paragraphId: string;
  text: string;
};

export type ParagraphUpdatedPayload = {
  paragraphId: string;
  text: string;
};

export type StateSyncPayload = {
  paragraphs: Array<{
    id: string;
    text: string;
    status: Extract<ParagraphStatus, "GENERATING" | "FINALIZED">;
    order: number;
  }>;
};

export type ErrorPayload = {
  code: WsErrorCode;
  message: string;
};

// ---- Discriminated Message Union ----

export type WsClientMessage =
  | WsEnvelope<SttSessionStartPayload> & { type: WsMessageType.STT_SESSION_START }
  | WsEnvelope<SttSessionStopPayload> & { type: WsMessageType.STT_SESSION_STOP }
  | WsEnvelope<AudioChunkPayload> & { type: WsMessageType.AUDIO_CHUNK }
  | WsEnvelope<ParagraphUpdatePayload> & { type: WsMessageType.PARAGRAPH_UPDATE };

export type WsServerMessage =
  | WsEnvelope<SttSessionStartedPayload> & { type: WsMessageType.STT_SESSION_STARTED }
  | WsEnvelope<SttSessionStoppedPayload> & { type: WsMessageType.STT_SESSION_STOPPED }
  | WsEnvelope<SttPartialResultPayload> & { type: WsMessageType.STT_PARTIAL_RESULT }
  | WsEnvelope<SttFinalResultPayload> & { type: WsMessageType.STT_FINAL_RESULT }
  | WsEnvelope<ParagraphCreatedPayload> & { type: WsMessageType.PARAGRAPH_CREATED }
  | WsEnvelope<ParagraphUpdatedPayload> & { type: WsMessageType.PARAGRAPH_UPDATED }
  | WsEnvelope<StateSyncPayload> & { type: WsMessageType.STATE_SYNC }
  | WsEnvelope<ErrorPayload> & { type: WsMessageType.ERROR };

