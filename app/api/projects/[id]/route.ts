import { NextRequest, NextResponse } from "next/server";
import { projectRepo } from "@/backend/repo/memory";

// PHASE 2: 프로젝트 단건 조회

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = projectRepo.get(params.id);
  if (!project) {
    return NextResponse.json({ message: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

