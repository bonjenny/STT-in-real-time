import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo, projectRepo } from "@/backend/repo/memory";

// PHASE 3: STT 세션 종료 (현재 GENERATING 단락을 FINALIZED로 전환)

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  try {
    const paragraph = paragraphRepo.finalizeGenerating(project.id);
    return NextResponse.json({ paragraph });
  } catch (err) {
    if (err instanceof Error && err.message === "NO_GENERATING") {
      return NextResponse.json(
        { message: "생성 중인 단락이 없어 세션을 종료할 수 없습니다." },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "알 수 없는 오류" }, { status: 500 });
  }
}

