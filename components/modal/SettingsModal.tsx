"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

type Settings = {
  language: "auto" | "ko" | "en";
  auto_sentence: boolean;
  live_preview: boolean;
};

type Props = {
  open: boolean;
  defaultSettings: Settings;
  onClose: () => void;
  onSave: (settings: Settings) => void;
};

export default function SettingsModal({
  open,
  defaultSettings,
  onClose,
  onSave,
}: Props) {
  const [settings, set_settings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    set_settings(defaultSettings);
  }, [defaultSettings]);

  const handle_save = () => {
    onSave(settings);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>설정</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1.5 }}>
          <FormControl fullWidth>
            <Typography variant="caption" sx={{ mb: 0.5, color: "text.secondary" }}>
              언어 선택
            </Typography>
            <Select
              value={settings.language}
              onChange={(e) =>
                set_settings((prev) => ({
                  ...prev,
                  language: e.target.value as Settings["language"],
                }))
              }
            >
              <MenuItem value="auto">자동 감지</MenuItem>
              <MenuItem value="ko">한국어</MenuItem>
              <MenuItem value="en">영어</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={settings.auto_sentence}
                onChange={(e) =>
                  set_settings((prev) => ({
                    ...prev,
                    auto_sentence: e.target.checked,
                  }))
                }
              />
            }
            label="자동 문장 분리"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.live_preview}
                onChange={(e) =>
                  set_settings((prev) => ({
                    ...prev,
                    live_preview: e.target.checked,
                  }))
                }
              />
            }
            label="실시간 미리보기"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handle_save} variant="contained">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

