import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo, projectRepo } from "@/backend/repo/memory";

// PHASE 3: STT 세션 시작 (AI/WS 없음, 생성 단락만 생성)

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  try {
    const paragraph = paragraphRepo.createGenerating(project.id);
    return NextResponse.json({ paragraph }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "GENERATING_EXISTS") {
      return NextResponse.json(
        { message: "이미 생성 중인 단락이 존재하여 세션을 시작할 수 없습니다." },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "알 수 없는 오류" }, { status: 500 });
  }
}

