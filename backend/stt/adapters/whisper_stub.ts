import { SttEngine, SttEngineSession, PartialResultHandler, FinalResultHandler } from "../engine";

// PHASE E: Whisper와 같이 스트리밍 미지원 엔진을 위한 의사-스트리밍 어댑터
// - 외부 API 호출 없음. 타이머로 partial/final을 흉내냄.
// - sendAudio는 버퍼 카운트만 증가시켜 배치 호출을 가정.

const samplePhrases = [
  "의사 스트리밍으로 부분 결과를 생성합니다.",
  "버퍼가 채워지면 배치 요청을 보낸다고 가정합니다.",
  "최종 결과를 합쳐서 반환합니다.",
];

class StubWhisperSession implements SttEngineSession {
  private partialHandlers: PartialResultHandler[] = [];
  private finalHandlers: FinalResultHandler[] = [];
  private closed = false;
  private bufferCount = 0;
  private timer: NodeJS.Timeout | null = null;
  private phraseIndex = 0;

  sendAudio(_chunk: Buffer): void {
    if (this.closed) return;
    this.bufferCount += 1;
    this.ensureTimer();
  }

  onPartialResult(cb: PartialResultHandler): void {
    this.partialHandlers.push(cb);
  }

  onFinalResult(cb: FinalResultHandler): void {
    this.finalHandlers.push(cb);
  }

  close(): void {
    this.closed = true;
    if (this.timer) clearInterval(this.timer);
  }

  private ensureTimer() {
    if (this.timer || this.closed) return;
    this.timer = setInterval(() => {
      if (this.closed) {
        if (this.timer) clearInterval(this.timer);
        return;
      }
      if (this.bufferCount <= 0) return;
      const phrase = samplePhrases[this.phraseIndex % samplePhrases.length];
      this.partialHandlers.forEach((cb) => cb(phrase));
      // 3번째마다 final로 확정
      if (this.phraseIndex % 3 === 2) {
        this.finalHandlers.forEach((cb) => cb(phrase));
      }
      this.phraseIndex += 1;
      this.bufferCount = 0;
    }, 1200);
  }
}

export class StubWhisperEngine implements SttEngine {
  startSession(_config: { language?: string }): SttEngineSession {
    return new StubWhisperSession();
  }
}

