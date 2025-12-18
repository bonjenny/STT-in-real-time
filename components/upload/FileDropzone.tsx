"use client";

import {
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { ChangeEvent, DragEvent, useState } from "react";

type Props = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

const accept_types = ["audio/mpeg", "audio/wav", "audio/x-m4a", "audio/mp4"];

export default function FileDropzone({ onFileSelect, disabled }: Props) {
  const theme = useTheme();
  const [is_drag_over, set_is_drag_over] = useState(false);

  const handle_file = (file?: File | null) => {
    if (!file) return;
    onFileSelect(file);
  };

  const on_drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    set_is_drag_over(false);
    const file = event.dataTransfer.files?.[0];
    handle_file(file);
  };

  const on_change = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handle_file(file);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        set_is_drag_over(true);
      }}
      onDragLeave={() => set_is_drag_over(false)}
      onDrop={on_drop}
      sx={{
        border: `2px dashed ${is_drag_over ? theme.palette.primary.main : "#d5dae3"}`,
        borderRadius: 2,
        background: "#fff",
        p: 4,
        textAlign: "center",
        transition: "border-color 0.2s ease",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <UploadFileRoundedIcon color="primary" fontSize="large" />
        <Typography variant="h6">드래그 & 드롭으로 파일 업로드</Typography>
        <Typography variant="body2" color="text.secondary">
          지원: mp3, wav, m4a
        </Typography>
        <Button variant="contained" component="label" disabled={disabled}>
          파일 선택
          <input
            type="file"
            hidden
            onChange={on_change}
            accept={accept_types.join(",")}
          />
        </Button>
      </Stack>
    </Box>
  );
}

