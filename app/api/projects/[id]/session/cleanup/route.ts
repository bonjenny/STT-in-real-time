import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo, projectRepo } from "@/backend/repo/memory";

// PHASE 7: 세션 안정성 - 비정상 종료 시 GENERATING 자동 정리
// - 존재하지 않는 프로젝트: 404
// - GENERATING 없으면 200 + 메시지
// - GENERATING 있으면 FINALIZED 처리 후 반환

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  const finalized = paragraphRepo.finalizeIfExists(project.id);
  if (!finalized) {
    return NextResponse.json(
      { message: "생성 중인 단락이 없어 정리할 세션이 없습니다." },
      { status: 200 },
    );
  }
  return NextResponse.json({ paragraph: finalized });
}

