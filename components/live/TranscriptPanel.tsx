"use client";

import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { TranscriptSegment } from "@/lib/types";

type Props = {
  partialText: string;
  finalSegments: TranscriptSegment[];
};

export default function TranscriptPanel({
  partialText,
  finalSegments,
}: Props) {
  return (
    <Card variant="outlined" sx={{ height: "100%", background: "#fff" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          실시간 텍스트
        </Typography>
        <Stack spacing={1} sx={{ minHeight: 200 }}>
          {partialText && (
            <Chip
              label={partialText}
              color="primary"
              variant="outlined"
              sx={{ alignSelf: "flex-start" }}
            />
          )}
          <Divider flexItem />
          <Stack spacing={1.5} sx={{ maxHeight: 380, overflowY: "auto" }}>
            {finalSegments.map((segment) => (
              <Typography
                key={segment.id}
                variant="body1"
                sx={{
                  background: "#f7f8fb",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                }}
              >
                {segment.text}
              </Typography>
            ))}
            {!finalSegments.length && (
              <Typography variant="body2" color="text.secondary">
                확정된 문장이 여기에 표시됩니다.
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

