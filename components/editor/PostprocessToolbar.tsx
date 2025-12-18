"use client";

import { FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { PostprocessOptions } from "@/lib/types";

type Props = {
  options: PostprocessOptions;
  onChange: (options: PostprocessOptions) => void;
};

export default function PostprocessToolbar({ options, onChange }: Props) {
  const handle_toggle = (key: keyof PostprocessOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
      sx={{
        border: "1px solid #e3e6ef",
        borderRadius: 2,
        p: 2,
        background: "#fff",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        후처리 옵션
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={options.spellcheck}
            onChange={() => handle_toggle("spellcheck")}
          />
        }
        label="맞춤법"
      />
      <FormControlLabel
        control={
          <Switch
            checked={options.filler_removal}
            onChange={() => handle_toggle("filler_removal")}
          />
        }
        label="추임새 제거"
      />
      <FormControlLabel
        control={
          <Switch
            checked={options.paragraph}
            onChange={() => handle_toggle("paragraph")}
          />
        }
        label="문단 분리"
      />
    </Stack>
  );
}

