import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo, projectRepo } from "@/backend/repo/memory";

// PHASE 2: 단락 리스트 조회 (order 기준 정렬)

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  const paragraphs = paragraphRepo.listByProject(params.id);
  return NextResponse.json({ paragraphs });
}

