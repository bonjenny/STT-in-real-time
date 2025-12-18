import { NextRequest, NextResponse } from "next/server";
import { projectRepo } from "@/backend/repo/memory";
import {
  getSessionIdByProject,
  handleEngineFailure,
} from "@/backend/stt/session_service";

// PHASE F: STT 엔진 오류 처리
// - 세션 존재 시 종료 + GENERATING 단락 FINALIZED
// - 세션 없으면 404

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  const sid = getSessionIdByProject(project.id);
  if (!sid) {
    return NextResponse.json({ message: "활성 세션이 없습니다." }, { status: 404 });
  }
  const paragraph = handleEngineFailure(sid);
  return NextResponse.json({ finalized: paragraph ?? null });
}

