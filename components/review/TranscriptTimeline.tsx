"use client";

import { List, ListItemButton, ListItemText } from "@mui/material";
import { TranscriptSegment } from "@/lib/types";

type Props = {
  segments: TranscriptSegment[];
  activeId?: string;
  onSelect: (segment: TranscriptSegment) => void;
};

export default function TranscriptTimeline({
  segments,
  activeId,
  onSelect,
}: Props) {
  return (
    <List dense sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2 }}>
      {segments.map((segment) => (
        <ListItemButton
          key={segment.id}
          selected={segment.id === activeId}
          onClick={() => onSelect(segment)}
          sx={{ borderBottom: "1px solid #f0f2f6" }}
        >
          <ListItemText
            primary={segment.text}
            secondary={
              segment.start !== undefined && segment.end !== undefined
                ? `${segment.start.toFixed(1)}s - ${segment.end.toFixed(1)}s`
                : undefined
            }
            primaryTypographyProps={{ sx: { color: "#1b1d29" } }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}

