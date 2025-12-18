import { SttEngine, SttEngineSession, PartialResultHandler, FinalResultHandler } from "./engine";

// PHASE A/B 더미 엔진: 외부 STT 호출 없음. sendAudio는 no-op, 콜백만 보유.

class DummySession implements SttEngineSession {
  private partialHandlers: PartialResultHandler[] = [];
  private finalHandlers: FinalResultHandler[] = [];
  private closed = false;

  sendAudio(_chunk: Buffer): void {
    // 실제 오디오 처리는 하지 않음
  }

  onPartialResult(cb: PartialResultHandler): void {
    this.partialHandlers.push(cb);
  }

  onFinalResult(cb: FinalResultHandler): void {
    this.finalHandlers.push(cb);
  }

  emitPartial(text: string) {
    if (this.closed) return;
    this.partialHandlers.forEach((cb) => cb(text));
  }

  emitFinal(text: string) {
    if (this.closed) return;
    this.finalHandlers.forEach((cb) => cb(text));
  }

  close(): void {
    this.closed = true;
  }
}

export class DummySttEngine implements SttEngine {
  startSession(_config: { language?: string }): SttEngineSession {
    return new DummySession();
  }
}

