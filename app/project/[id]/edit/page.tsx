"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Container, Stack, Typography } from "@mui/material";
import Header from "@/components/layout/Header";
import PostprocessToolbar from "@/components/editor/PostprocessToolbar";
import EditableTranscript from "@/components/editor/EditableTranscript";
import UndoRedoControls from "@/components/editor/UndoRedoControls";
import ExportModal from "@/components/modal/ExportModal";
import { PostprocessOptions } from "@/lib/types";
import { mock_segments } from "@/lib/mock";
import { useSnackbar } from "notistack";

const initial_text = mock_segments.map((s) => s.text).join("\n");

export default function EditPage() {
  const params = useParams<{ id: string }>();
  const project_id = useMemo(() => params?.id ?? "project", [params]);
  const { enqueueSnackbar } = useSnackbar();

  const [options, set_options] = useState<PostprocessOptions>({
    spellcheck: false,
    filler_removal: false,
    paragraph: false,
  });
  const [content, set_content] = useState(initial_text);
  const [undo_stack, set_undo_stack] = useState<string[]>([]);
  const [redo_stack, set_redo_stack] = useState<string[]>([]);
  const [export_open, set_export_open] = useState(false);

  const push_history = (next: string) => {
    set_undo_stack((prev) => [...prev, content]);
    set_redo_stack([]);
    set_content(next);
  };

  const handle_change = (value: string) => {
    push_history(value);
  };

  const handle_undo = () => {
    const last = undo_stack.at(-1);
    if (!last) return;
    set_undo_stack((prev) => prev.slice(0, -1));
    set_redo_stack((prev) => [...prev, content]);
    set_content(last);
  };

  const handle_redo = () => {
    const last = redo_stack.at(-1);
    if (!last) return;
    set_redo_stack((prev) => prev.slice(0, -1));
    set_undo_stack((prev) => [...prev, content]);
    set_content(last);
  };

  const apply_postprocess = (next_options: PostprocessOptions) => {
    let next_text = content;
    if (next_options.filler_removal) {
      next_text = next_text.replace(/\b(음+|어+|그+)\b/g, "").replace(/\s{2,}/g, " ");
    }
    if (next_options.paragraph) {
      next_text = next_text.replace(/([\.!?])\s+/g, "$1\n\n");
    }
    if (next_options.spellcheck) {
      enqueueSnackbar("맞춤법 교정(목업) 적용됨", { variant: "info" });
    }
    set_content(next_text.trim());
  };

  const handle_option_change = (next: PostprocessOptions) => {
    set_options(next);
    apply_postprocess(next);
  };

  const handle_export = (payload: { format: "txt" | "docx" | "srt" | "md"; name: string }) => {
    enqueueSnackbar(`${payload.format.toUpperCase()} 내보내기 준비 완료`, { variant: "success" });
    set_export_open(false);
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" sx={{ mb: 3 }}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              프로젝트 {project_id} · 텍스트 편집
            </Typography>
            <Typography variant="body2" color="text.secondary">
              후처리 옵션을 적용하고 내용을 직접 수정하세요.
            </Typography>
          </div>
          <Box>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => set_export_open(true)}
            >
              내보내기
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={2.5}>
          <PostprocessToolbar options={options} onChange={handle_option_change} />
          <EditableTranscript value={content} onChange={handle_change} />
          <UndoRedoControls
            onUndo={handle_undo}
            onRedo={handle_redo}
            canUndo={undo_stack.length > 0}
            canRedo={redo_stack.length > 0}
          />
        </Stack>
      </Container>
      <ExportModal
        open={export_open}
        defaultName={`project_${project_id}`}
        onClose={() => set_export_open(false)}
        onExport={handle_export}
      />
    </>
  );
}

