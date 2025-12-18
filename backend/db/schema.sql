-- Phase 1: 데이터 모델 정의 (API/비즈니스 로직/WS 없음)
-- 대상 DB: PostgreSQL 가정 (부분 인덱스/체크 제약 사용)

-- 프로젝트 테이블
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200) NOT NULL,
  owner_id    UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 단락 테이블
CREATE TABLE IF NOT EXISTS transcript_paragraphs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "order"       INTEGER NOT NULL,
  text          TEXT NOT NULL DEFAULT '',
  status        VARCHAR(16) NOT NULL CHECK (status IN ('GENERATING', 'FINALIZED')),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalized_at  TIMESTAMPTZ
);

-- 한 프로젝트 내 단락 순서 유니크
CREATE UNIQUE INDEX IF NOT EXISTS uq_paragraph_order
  ON transcript_paragraphs (project_id, "order");

-- 한 프로젝트당 GENERATING 단락은 최대 1개 (부분 인덱스)
CREATE UNIQUE INDEX IF NOT EXISTS uq_project_generating_once
  ON transcript_paragraphs (project_id)
  WHERE status = 'GENERATING';

-- UPDATED_AT 트리거(선택): Phase 1에서는 정의만, 함수/트리거 미구현
-- 추후 Prisma/ORM 사용 시 모델 레벨에서 updated_at 관리 가능.

