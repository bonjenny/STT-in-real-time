import { NextRequest, NextResponse } from "next/server";
import { projectRepo } from "@/backend/repo/memory";

// PHASE 2: 프로젝트 CRUD 중 생성, 목록 조회. STT/WS/AI 없음.

export async function GET() {
  const data = projectRepo.list();
  return NextResponse.json({ projects: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.ownerId !== "string") {
    return NextResponse.json({ message: "title, ownerId는 필수입니다." }, { status: 400 });
  }
  const project = projectRepo.create({ title: body.title.trim(), ownerId: body.ownerId.trim() });
  return NextResponse.json({ project }, { status: 201 });
}

