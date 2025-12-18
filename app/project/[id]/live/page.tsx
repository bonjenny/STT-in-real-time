"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import Header from "@/components/layout/Header";
import RecordPanel from "@/components/live/RecordPanel";
import TranscriptPanel from "@/components/live/TranscriptPanel";
import ExportModal from "@/components/modal/ExportModal";
import SettingsModal from "@/components/modal/SettingsModal";
import { TranscriptSegment } from "@/lib/types";
import { useSnackbar } from "notistack";

const sample_phrases = [
  "지금 말씀하신 내용을 인식하고 있어요.",
  "회의록에 추가할 문장을 확인하세요.",
  "배경 소음이 있어도 처리 중입니다.",
];

export default function LivePage() {
  const params = useParams<{ id: string }>();
  const project_id = useMemo(() => params?.id ?? "project", [params]);
  const { enqueueSnackbar } = useSnackbar();

  const [session_state, set_session_state] = useState<
    "idle" | "recording" | "paused" | "stopped"
  >("idle");
  const [elapsed_seconds, set_elapsed_seconds] = useState(0);
  const [partial_text, set_partial_text] = useState("");
  const [final_segments, set_final_segments] = useState<TranscriptSegment[]>([]);

  const [export_open, set_export_open] = useState(false);
  const [settings_open, set_settings_open] = useState(false);
  const [settings, set_settings] = useState({
    language: "auto" as const,
    auto_sentence: true,
    live_preview: true,
  });

  useEffect(() => {
    if (session_state !== "recording") return;
    const timer = setInterval(() => {
      set_elapsed_seconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [session_state]);

  useEffect(() => {
    if (session_state !== "recording") return;
    let phrase_index = 0;
    const interval = setInterval(() => {
      const phrase = sample_phrases[phrase_index % sample_phrases.length];
      set_partial_text(phrase);
      set_final_segments((prev) => [
        ...prev,
        {
          id: `seg-${Date.now()}`,
          text: phrase,
          status: "final",
        },
      ]);
      phrase_index += 1;
    }, 2200);
    return () => clearInterval(interval);
  }, [session_state]);

  const handle_record = () => {
    set_session_state("recording");
    set_partial_text("");
    enqueueSnackbar("녹음을 시작합니다.", { variant: "info" });
  };

  const handle_pause = () => {
    set_session_state("paused");
    enqueueSnackbar("일시정지되었습니다.", { variant: "warning" });
  };

  const handle_stop = () => {
    set_session_state("stopped");
    set_partial_text("");
    enqueueSnackbar("녹음이 종료되었습니다.", { variant: "success" });
  };

  const handle_export = (payload: { format: "txt" | "docx" | "srt" | "md"; name: string }) => {
    enqueueSnackbar(`${payload.format.toUpperCase()}로 내보내기 준비 완료`, {
      variant: "success",
    });
    set_export_open(false);
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              프로젝트 {project_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              실시간 STT · 언어 {settings.language === "auto" ? "자동" : settings.language}
            </Typography>
          </div>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<SettingsRoundedIcon />}
              onClick={() => set_settings_open(true)}
            >
              설정
            </Button>
            <Button
              variant="contained"
              startIcon={<IosShareRoundedIcon />}
              onClick={() => set_export_open(true)}
            >
              내보내기
            </Button>
          </Stack>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <RecordPanel
              sessionState={session_state}
              elapsedSeconds={elapsed_seconds}
              onRecord={handle_record}
              onPause={handle_pause}
              onStop={handle_stop}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <TranscriptPanel partialText={partial_text} finalSegments={final_segments} />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}>
          네트워크 끊김 시 자동 재시도, 페이지 이탈 시 확인 모달 표시 예정 (목업 상태)
        </Box>
      </Container>
      <ExportModal
        open={export_open}
        defaultName={`project_${project_id}`}
        onClose={() => set_export_open(false)}
        onExport={handle_export}
      />
      <SettingsModal
        open={settings_open}
        defaultSettings={settings}
        onClose={() => set_settings_open(false)}
        onSave={(next) => {
          set_settings(next);
          set_settings_open(false);
          enqueueSnackbar("설정이 적용되었습니다.", { variant: "success" });
        }}
      />
    </>
  );
}

