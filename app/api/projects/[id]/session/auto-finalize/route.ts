import { NextRequest, NextResponse } from "next/server";
import {
  forceFinalize,
  shouldFinalizeByLength,
  shouldFinalizeBySilence,
} from "@/backend/stt/session_service";

// PHASE D: 문단 확정 트리거 API (무음/글자수 조건 확인 후 finalize)
// - 실제로는 타이머/워커/WS 이벤트 등으로 호출될 수 있으나 여기서는 HTTP 트리거만 제공

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const sessionId = params.id; // 세션 ID를 path param으로 사용 (프런트 세션별 관리 가정)
  try {
    const hitSilence = shouldFinalizeBySilence(sessionId);
    const hitLength = shouldFinalizeByLength(sessionId);
    if (!hitSilence && !hitLength) {
      return NextResponse.json({ finalized: false, reason: "no-trigger" });
    }
    forceFinalize(sessionId);
    return NextResponse.json({ finalized: true, reason: hitSilence ? "silence" : "length" });
  } catch (err) {
    if (err instanceof Error && err.message === "SESSION_NOT_FOUND") {
      return NextResponse.json({ message: "세션을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ message: "알 수 없는 오류" }, { status: 500 });
  }
}

