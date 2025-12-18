// STT_SESSION_START / STOP 전용 WebSocket 핸들러 (AUDIO_CHUNK, STT 결과 처리 없음)
import {
  WsClientMessage,
  WsEnvelope,
  WsMessageType,
  WsServerMessage,
  WsErrorCode,
} from "./ws_types";
import { SttEngine } from "./engine";
import { DummySttEngine } from "./dummy_engine";
import {
  startSttSession,
  stopSessionByProject,
} from "./session_service";

type SendFn = (message: WsServerMessage) => void;

type HandlerDeps = {
  engine?: SttEngine; // 주입 가능, 기본 Dummy
};

const now = () => Date.now();

const buildEnvelope = <T>(type: WsMessageType, payload: T): WsEnvelope<T> => ({
  type,
  payload,
  timestamp: now(),
});

export function handleClientMessage(
  msg: WsClientMessage,
  send: SendFn,
  deps: HandlerDeps = {},
) {
  const engine = deps.engine ?? new DummySttEngine();

  switch (msg.type) {
    case WsMessageType.STT_SESSION_START: {
      try {
        const state = startSttSession(msg.payload.projectId, engine);
        send(
          buildEnvelope(WsMessageType.STT_SESSION_STARTED, {
            paragraphId: state.generatingParagraphId,
          }),
        );
      } catch (err) {
        const code =
          err instanceof Error && err.message === "SESSION_EXISTS"
            ? WsErrorCode.SESSION_EXISTS
            : err instanceof Error && err.message === "PROJECT_NOT_FOUND"
            ? WsErrorCode.INVALID_STATE
            : WsErrorCode.INTERNAL_ERROR;
        send(
          buildEnvelope(WsMessageType.ERROR, {
            code,
            message: err instanceof Error ? err.message : "unknown error",
          }),
        );
      }
      break;
    }

    case WsMessageType.STT_SESSION_STOP: {
      try {
        const paragraph = stopSessionByProject(msg.payload["projectId" as never] ?? "");
        // STOP payload에는 projectId 없음 → 세션을 종료해도 finalizedParagraphId가 없을 수 있음
        send(
          buildEnvelope(WsMessageType.STT_SESSION_STOPPED, {
            finalizedParagraphId: paragraph?.id ?? null,
          }),
        );
      } catch (err) {
        send(
          buildEnvelope(WsMessageType.ERROR, {
            code: WsErrorCode.INTERNAL_ERROR,
            message: err instanceof Error ? err.message : "unknown error",
          }),
        );
      }
      break;
    }

    default:
      send(
        buildEnvelope(WsMessageType.ERROR, {
          code: WsErrorCode.INVALID_STATE,
          message: "지원하지 않는 메시지 타입입니다.",
        }),
      );
  }
}

