import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo, projectRepo } from "@/backend/repo/memory";

// PHASE 4: STT 텍스트 스트리밍 (목업)
// - AI 호출 없음, 임의 문자열을 주기적으로 GENERATING 단락에만 append
// - FINALIZED 단락은 변경하지 않음
// - 프론트에는 전체 단락 스냅샷을 SSE로 전달

export const dynamic = "force-dynamic";

const samples = [
  "현재 발화 내용을 받아 기록합니다.",
  "다음 단락에 추가 문장을 작성 중입니다.",
  "잡음 환경에서도 처리를 이어갑니다.",
  "문장 경계를 감지하고 있습니다.",
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const generating = paragraphRepo.findGenerating(project.id);
  if (!generating) {
    return NextResponse.json(
      { message: "생성 중인 단락이 없습니다. 세션을 먼저 시작하세요." },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  let timer: NodeJS.Timeout | null = null;
  let index = 0;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const tick = () => {
        try {
          const phrase = samples[index % samples.length];
          paragraphRepo.appendToGenerating(project.id, phrase);
          const snapshot = paragraphRepo.listByProject(project.id);
          send({ paragraphs: snapshot });
          index += 1;
        } catch (err) {
          if (err instanceof Error && err.message === "NO_GENERATING") {
            send({ error: "생성 중인 단락이 없습니다. 스트림을 종료합니다." });
          } else {
            send({ error: "알 수 없는 오류가 발생했습니다." });
          }
          controller.close();
          if (timer) clearInterval(timer);
        }
      };

      timer = setInterval(tick, 1500);
      tick(); // 즉시 한 번 전송

      req.signal.addEventListener("abort", () => {
        if (timer) clearInterval(timer);
        controller.close();
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

