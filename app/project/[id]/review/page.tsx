"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import Header from "@/components/layout/Header";
import TranscriptTimeline from "@/components/review/TranscriptTimeline";
import { TranscriptSegment } from "@/lib/types";
import { mock_segments } from "@/lib/mock";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const project_id = useMemo(() => params?.id ?? "project", [params]);
  const audio_ref = useRef<HTMLAudioElement | null>(null);
  const [segments] = useState<TranscriptSegment[]>(mock_segments);
  const [active_id, set_active_id] = useState<string | undefined>(segments[0]?.id);

  useEffect(() => {
    const audio = audio_ref.current;
    if (!audio) return;
    const handle_time = () => {
      const current = audio.currentTime;
      const current_segment = segments.find(
        (seg) =>
          seg.start !== undefined &&
          seg.end !== undefined &&
          current >= seg.start &&
          current <= seg.end,
      );
      if (current_segment) {
        set_active_id(current_segment.id);
      }
    };
    audio.addEventListener("timeupdate", handle_time);
    return () => audio.removeEventListener("timeupdate", handle_time);
  }, [segments]);

  const handle_select_segment = (segment: TranscriptSegment) => {
    set_active_id(segment.id);
    if (audio_ref.current && segment.start !== undefined) {
      audio_ref.current.currentTime = segment.start;
      audio_ref.current.play();
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Stack spacing={3}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              프로젝트 {project_id} · 재생/동기화
            </Typography>
            <Typography variant="body2" color="text.secondary">
              텍스트 클릭 시 해당 타임라인으로 이동합니다. 재생 위치에 따라 텍스트가 하이라이트됩니다.
            </Typography>
          </div>
          <Card>
            <CardContent>
              <audio
                ref={audio_ref}
                controls
                style={{ width: "100%" }}
                src="https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
              />
            </CardContent>
          </Card>
          <Box>
            <TranscriptTimeline
              segments={segments}
              activeId={active_id}
              onSelect={handle_select_segment}
            />
          </Box>
        </Stack>
      </Container>
    </>
  );
}

