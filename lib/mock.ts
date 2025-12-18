import { Project, TranscriptSegment } from "./types";

export const mock_projects: Project[] = [
  {
    id: "p-001",
    name: "회의록 2025-01",
    mode: "live",
    updated_at: "2025-12-10T09:00:00Z",
  },
  {
    id: "p-002",
    name: "인터뷰 샘플",
    mode: "upload",
    updated_at: "2025-12-12T11:30:00Z",
  },
  {
    id: "p-003",
    name: "강의 데모",
    mode: "live",
    updated_at: "2025-12-14T15:40:00Z",
  },
];

export const mock_segments: TranscriptSegment[] = [
  {
    id: "s-1",
    text: "안녕하세요, 오늘 회의 시작하겠습니다.",
    start: 0,
    end: 3.5,
    status: "final",
  },
  {
    id: "s-2",
    text: "이번 안건은 제품 출시 일정입니다.",
    start: 3.5,
    end: 7.2,
    status: "final",
  },
  {
    id: "s-3",
    text: "추가 의견 있으신가요?",
    start: 7.2,
    end: 10.5,
    status: "final",
  },
];

