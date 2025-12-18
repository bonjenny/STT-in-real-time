"use client";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import {
  Box,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ParagraphStatus } from "@/lib/types";

type Props = {
  paragraphId: string;
  status: ParagraphStatus;
  text: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  onBlurEdit?: () => void;
};

export default function TranscriptParagraph({
  paragraphId,
  status,
  text,
  onClick,
  onChange,
  onBlurEdit,
}: Props) {
  const theme = useTheme();
  const is_generating = status === "GENERATING";
  const is_editing = status === "EDITING";

  const base = (
    <Box
      onClick={is_generating ? undefined : onClick}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: is_generating
          ? "1px dashed #cfd6e4"
          : is_editing
          ? `1px solid ${theme.palette.primary.main}`
          : "1px solid #e3e6ef",
        backgroundColor: is_generating
          ? "#fafbfe"
          : is_editing
          ? alpha(theme.palette.primary.light, 0.12)
          : "#fff",
        cursor: is_generating ? "not-allowed" : "text",
        userSelect: is_generating ? "none" : "text",
        pointerEvents: is_generating ? "auto" : "auto",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        boxShadow: is_editing ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}` : "none",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        {is_generating && (
          <>
            <LockRoundedIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              AI 작성 중…
            </Typography>
          </>
        )}
        {is_editing && (
          <>
            <ModeEditOutlineRoundedIcon fontSize="small" color="primary" />
            <Typography variant="caption" color="primary">
              편집 중
            </Typography>
          </>
        )}
      </Stack>
      {is_editing ? (
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={text}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlurEdit}
          autoFocus
          variant="standard"
          InputProps={{ disableUnderline: true }}
        />
      ) : (
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "#1b1d29" }}>
          {text}
        </Typography>
      )}
    </Box>
  );

  if (is_generating) {
    return (
      <Tooltip
        title="AI가 생성 중인 단락입니다. 완료 후 수정할 수 있습니다."
        placement="top-start"
        arrow
      >
        <Box>{base}</Box>
      </Tooltip>
    );
  }

  return base;
}

