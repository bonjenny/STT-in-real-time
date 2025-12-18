import { SttEngine, SttEngineSession, PartialResultHandler, FinalResultHandler } from "../engine";

// PHASE E(스켈레톤): Whisper 등 배치/의사-스트리밍 엔진을 감싸기 위한 어댑터 틀
// 실제 외부 호출/토큰/요청 전송 로직은 구현하지 않는다.

class StubWhisperSession implements SttEngineSession {
  private partialHandlers: PartialResultHandler[] = [];
  private finalHandlers: FinalResultHandler[] = [];
  private closed = false;

  sendAudio(_chunk: Buffer): void {
    // 향후: chunk 버퍼링 후 주기적 batch 호출로 partial/final 흉내
  }

  onPartialResult(cb: PartialResultHandler): void {
    this.partialHandlers.push(cb);
  }

  onFinalResult(cb: FinalResultHandler): void {
    this.finalHandlers.push(cb);
  }

  close(): void {
    this.closed = true;
  }

  // 데모용 수동 트리거 (테스트/목업)
  emitPartial(text: string) {
    if (this.closed) return;
    this.partialHandlers.forEach((cb) => cb(text));
  }

  emitFinal(text: string) {
    if (this.closed) return;
    this.finalHandlers.forEach((cb) => cb(text));
  }
}

export class StubWhisperEngine implements SttEngine {
  startSession(_config: { language?: string }): SttEngineSession {
    return new StubWhisperSession();
  }
}

