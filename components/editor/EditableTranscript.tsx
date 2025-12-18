"use client";

import { Paper, TextField } from "@mui/material";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function EditableTranscript({ value, onChange }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        minHeight: 320,
        background: "#fff",
        borderRadius: 2,
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={12}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="변환된 텍스트를 편집하세요."
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
      />
    </Paper>
  );
}

