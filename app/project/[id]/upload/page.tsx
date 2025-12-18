"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Stack, Typography } from "@mui/material";
import Header from "@/components/layout/Header";
import FileDropzone from "@/components/upload/FileDropzone";
import UploadProgress from "@/components/upload/UploadProgress";
import { JobStatus } from "@/lib/types";
import { useSnackbar } from "notistack";

export default function UploadPage() {
  const params = useParams<{ id: string }>();
  const project_id = useMemo(() => params?.id ?? "project", [params]);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [job_status, set_job_status] = useState<JobStatus>("queued");
  const [progress, set_progress] = useState(0);

  useEffect(() => {
    if (job_status !== "processing") return;
    const interval = setInterval(() => {
      set_progress((prev) => {
        if (prev >= 100) return 100;
        return prev + 8;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [job_status]);

  useEffect(() => {
    if (progress >= 100 && job_status === "processing") {
      set_job_status("done");
      enqueueSnackbar("변환이 완료되었습니다. 편집 화면으로 이동합니다.", {
        variant: "success",
      });
      const timeout = setTimeout(() => {
        router.push(`/project/${project_id}/edit`);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [progress, job_status, router, project_id, enqueueSnackbar]);

  const handle_file = (file: File) => {
    const is_supported = ["audio/mpeg", "audio/wav", "audio/x-m4a", "audio/mp4"].includes(
      file.type,
    );
    if (!is_supported) {
      enqueueSnackbar("지원하지 않는 파일 형식입니다.", { variant: "error" });
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      enqueueSnackbar("파일 용량은 최대 30MB까지 지원합니다.", { variant: "warning" });
      return;
    }
    enqueueSnackbar(`업로드 시작: ${file.name}`, { variant: "info" });
    set_job_status("processing");
    set_progress(10);
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Stack spacing={3}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              프로젝트 {project_id} · 파일 업로드 STT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              mp3 / wav / m4a 업로드 후 변환 진행 상태를 실시간으로 확인하세요.
            </Typography>
          </div>
          <FileDropzone onFileSelect={handle_file} disabled={job_status === "processing"} />
          <UploadProgress status={job_status} progress={progress} />
        </Stack>
      </Container>
    </>
  );
}

