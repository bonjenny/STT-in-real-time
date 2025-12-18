"use client";

import { Button, Stack } from "@mui/material";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";

type Props = {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function UndoRedoControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined"
        startIcon={<UndoRoundedIcon />}
        onClick={onUndo}
        disabled={!canUndo}
      >
        실행 취소
      </Button>
      <Button
        variant="outlined"
        startIcon={<RedoRoundedIcon />}
        onClick={onRedo}
        disabled={!canRedo}
      >
        다시 실행
      </Button>
    </Stack>
  );
}

