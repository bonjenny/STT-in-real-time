"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  defaultName: string;
  onClose: () => void;
  onExport: (payload: { format: "txt" | "docx" | "srt" | "md"; name: string }) => void;
};

const format_options = [
  { value: "txt", label: "TXT" },
  { value: "docx", label: "DOCX" },
  { value: "srt", label: "SRT" },
  { value: "md", label: "Markdown" },
] as const;

export default function ExportModal({
  open,
  defaultName,
  onClose,
  onExport,
}: Props) {
  const [format, set_format] = useState<"txt" | "docx" | "srt" | "md">("txt");
  const [name, set_name] = useState(defaultName);

  useEffect(() => {
    set_name(defaultName);
  }, [defaultName]);

  const handle_export = () => {
    if (!name.trim()) return;
    onExport({ format, name: name.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>내보내기</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl>
            <RadioGroup
              row
              value={format}
              onChange={(e) =>
                set_format(e.target.value as "txt" | "docx" | "srt" | "md")
              }
            >
              {format_options.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <TextField
            label="파일명"
            value={name}
            onChange={(e) => set_name(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handle_export} variant="contained" disabled={!name.trim()}>
          다운로드
        </Button>
      </DialogActions>
    </Dialog>
  );
}

