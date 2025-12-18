export type ProjectMode = "live" | "upload";

export type Project = {
  id: string;
  name: string;
  mode: ProjectMode;
  updated_at: string;
};

export type TranscriptSegment = {
  id: string;
  text: string;
  start?: number;
  end?: number;
  status: "partial" | "final";
};

export type PostprocessOptions = {
  spellcheck: boolean;
  filler_removal: boolean;
  paragraph: boolean;
};

export type JobStatus = "queued" | "processing" | "done" | "error";

