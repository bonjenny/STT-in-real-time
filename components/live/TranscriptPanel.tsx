"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import TranscriptParagraph from "./TranscriptParagraph";
import { Paragraph } from "@/lib/types";

type Props = {
  paragraphs: Paragraph[];
  generatingParagraphId: string | null;
  editingParagraphId: string | null;
  onSelectParagraph: (id: string) => void;
  onChangeParagraph: (id: string, text: string) => void;
  onBlurEdit: (id: string) => void;
};

export default function TranscriptPanel({
  paragraphs,
  generatingParagraphId,
  editingParagraphId,
  onSelectParagraph,
  onChangeParagraph,
  onBlurEdit,
}: Props) {
  return (
    <Card variant="outlined" sx={{ height: "100%", background: "#fff" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          단락 단위 실시간 텍스트
        </Typography>
        <Stack spacing={1.25} sx={{ maxHeight: 520, overflowY: "auto" }}>
          {paragraphs.map((p) => (
            <TranscriptParagraph
              key={p.id}
              paragraphId={p.id}
              status={p.status}
              text={p.text}
              onClick={() => onSelectParagraph(p.id)}
              onChange={(val) => onChangeParagraph(p.id, val)}
              onBlurEdit={() => onBlurEdit(p.id)}
            />
          ))}
          {!paragraphs.length && (
            <Typography variant="body2" color="text.secondary">
              단락이 없습니다. 녹음을 시작하면 AI가 단락을 생성합니다.
            </Typography>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          AI 생성 단락과 편집 단락은 완전히 분리되어 업데이트/커서가 충돌하지 않습니다.
          현재 생성 단락: {generatingParagraphId ?? "없음"}, 편집 단락: {editingParagraphId ?? "없음"}
        </Typography>
      </CardContent>
    </Card>
  );
}

