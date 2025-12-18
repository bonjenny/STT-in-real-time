import { NextRequest, NextResponse } from "next/server";
import { paragraphRepo } from "@/backend/repo/memory";

// PHASE 6: FINALIZED 단락 수정 API (전체 overwrite)

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.text !== "string") {
    return NextResponse.json({ message: "text 필드는 필수입니다." }, { status: 400 });
  }
  const paragraph = paragraphRepo.getById(params.id);
  if (!paragraph) {
    return NextResponse.json({ message: "단락을 찾을 수 없습니다." }, { status: 404 });
  }
  if (paragraph.status !== "FINALIZED") {
    return NextResponse.json(
      { message: "FINALIZED 단락만 수정할 수 있습니다." },
      { status: 400 },
    );
  }
  paragraphRepo.updateText(paragraph.id, body.text);
  const updated = paragraphRepo.getById(paragraph.id)!;
  return NextResponse.json({ paragraph: updated });
}

