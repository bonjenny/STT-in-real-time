"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";

type Props = {
  sessionState: "idle" | "recording" | "paused" | "stopped";
  elapsedSeconds: number;
  onRecord: () => void;
  onPause: () => void;
  onStop: () => void;
};

const format_time = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
};

export default function RecordPanel({
  sessionState,
  elapsedSeconds,
  onRecord,
  onPause,
  onStop,
}: Props) {
  const is_recording = sessionState === "recording";
  const is_paused = sessionState === "paused";

  return (
    <Card variant="outlined" sx={{ height: "100%", background: "#fff" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          녹음 제어
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<FiberManualRecordRoundedIcon />}
            color={is_recording ? "primary" : "error"}
            onClick={onRecord}
            disabled={is_recording}
          >
            녹음
          </Button>
          <Button
            variant="outlined"
            startIcon={<PauseRoundedIcon />}
            onClick={onPause}
            disabled={!is_recording}
          >
            일시정지
          </Button>
          <Button
            variant="outlined"
            startIcon={<StopRoundedIcon />}
            onClick={onStop}
            disabled={sessionState === "idle" || sessionState === "stopped"}
            color="inherit"
          >
            종료
          </Button>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {format_time(elapsedSeconds)}
        </Typography>
        <Box
          sx={{
            flex: 1,
            borderRadius: 2,
            border: "1px dashed #d5dae3",
            background:
              is_recording || is_paused ? "linear-gradient(90deg,#eef3ff,#f7f8fb)" : "#f7f8fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8a92a6",
            fontSize: 14,
          }}
        >
          파형 영역 (목업)
        </Box>
        <Typography variant="body2" color="text.secondary">
          상태: {sessionState === "recording" ? "녹음 중" : sessionState === "paused" ? "일시정지" : sessionState === "stopped" ? "종료" : "대기"}
        </Typography>
      </CardContent>
    </Card>
  );
}

