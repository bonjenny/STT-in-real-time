import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo, projectRepo } from "@/backend/repo/memory";

// PHASE 5: 단락 확정 처리 (무음/종료/Final 이벤트 트리거)
// - 현재 GENERATING 단락을 FINALIZED로 전환
// - 새 GENERATING 단락을 생성하여 스트림 대상 유지

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  try {
    const { finalized, next } = paragraphRepo.finalizeAndCreateNext(project.id);
    return NextResponse.json({ finalized, next });
  } catch (err) {
    if (err instanceof Error && err.message === "NO_GENERATING") {
      return NextResponse.json(
        { message: "생성 중인 단락이 없어 확정할 수 없습니다." },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message === "GENERATING_EXISTS") {
      return NextResponse.json(
        { message: "이미 생성 중인 단락이 존재하여 새 단락을 만들 수 없습니다." },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "알 수 없는 오류" }, { status: 500 });
  }
}

