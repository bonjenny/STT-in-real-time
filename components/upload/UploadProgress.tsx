"use client";

import { Alert, LinearProgress, Stack, Typography } from "@mui/material";
import { JobStatus } from "@/lib/types";

type Props = {
  status: JobStatus;
  progress: number;
};

export default function UploadProgress({ status, progress }: Props) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" color="text.secondary">
        처리 상태
      </Typography>
      <LinearProgress
        variant={status === "processing" ? "determinate" : "indeterminate"}
        value={status === "processing" ? progress : undefined}
        sx={{ height: 10, borderRadius: 12 }}
      />
      <Alert severity={status === "error" ? "error" : "info"}>
        {status === "queued" && "처리 대기 중입니다."}
        {status === "processing" && `처리 중 (${progress.toFixed(0)}%)`}
        {status === "done" && "완료되었습니다. 편집 화면으로 이동하세요."}
        {status === "error" && "오류가 발생했습니다. 다시 시도하세요."}
      </Alert>
    </Stack>
  );
}

