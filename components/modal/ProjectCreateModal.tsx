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
import { useState, useEffect } from "react";
import { ProjectMode } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { name: string; mode: ProjectMode }) => void;
};

export default function ProjectCreateModal({ open, onClose, onCreate }: Props) {
  const [name, set_name] = useState("");
  const [mode, set_mode] = useState<ProjectMode>("live");

  useEffect(() => {
    if (!open) {
      set_name("");
      set_mode("live");
    }
  }, [open]);

  const handle_submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), mode });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>새 프로젝트</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="프로젝트 이름"
            value={name}
            onChange={(e) => set_name(e.target.value)}
            fullWidth
            autoFocus
          />
          <FormControl>
            <RadioGroup
              value={mode}
              onChange={(e) => set_mode(e.target.value as ProjectMode)}
            >
              <FormControlLabel
                value="live"
                control={<Radio />}
                label="실시간 녹음"
              />
              <FormControlLabel
                value="upload"
                control={<Radio />}
                label="음성 파일 업로드"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button
          onClick={handle_submit}
          variant="contained"
          disabled={!name.trim()}
        >
          시작
        </Button>
      </DialogActions>
    </Dialog>
  );
}

