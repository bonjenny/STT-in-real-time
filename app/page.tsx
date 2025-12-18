"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Header from "@/components/layout/Header";
import ProjectCreateModal from "@/components/modal/ProjectCreateModal";
import { mock_projects } from "@/lib/mock";
import { Project } from "@/lib/types";
import { useSnackbar } from "notistack";

export default function Home() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [projects, set_projects] = useState<Project[]>(mock_projects);
  const [filter, set_filter] = useState("");
  const [modal_open, set_modal_open] = useState(false);

  const filtered_projects = useMemo(() => {
    const keyword = filter.trim().toLowerCase();
    if (!keyword) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(keyword));
  }, [projects, filter]);

  const handle_create = ({ name, mode }: { name: string; mode: Project["mode"] }) => {
    const new_project: Project = {
      id: `p-${Date.now()}`,
      name,
      mode,
      updated_at: new Date().toISOString(),
    };
    set_projects((prev) => [new_project, ...prev]);
    enqueueSnackbar("프로젝트가 생성되었습니다.", { variant: "success" });
    set_modal_open(false);
    router.push(`/project/${new_project.id}/${mode === "live" ? "live" : "upload"}`);
  };

  const handle_open_project = (project: Project) => {
    router.push(`/project/${project.id}/${project.mode === "live" ? "live" : "upload"}`);
  };

  return (
    <>
      <Header onNewProjectClick={() => set_modal_open(true)} />
      <Container sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            최근 프로젝트
          </Typography>
          <TextField
            placeholder="프로젝트 검색"
            size="small"
            value={filter}
            onChange={(e) => set_filter(e.target.value)}
            sx={{ width: 260 }}
          />
        </Stack>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {filtered_projects.slice(0, 3).map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} onOpen={() => handle_open_project(project)} />
            </Grid>
          ))}
          {!filtered_projects.length && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography color="text.secondary">프로젝트가 없습니다. 새로 만들어보세요.</Typography>
              </Card>
            </Grid>
          )}
        </Grid>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          전체 프로젝트
        </Typography>
        <Grid container spacing={2}>
          {filtered_projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} onOpen={() => handle_open_project(project)} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <ProjectCreateModal
        open={modal_open}
        onClose={() => set_modal_open(false)}
        onCreate={handle_create}
      />
    </>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const updated_at = dayjs(project.updated_at).format("YYYY.MM.DD HH:mm");
  return (
    <Card variant="outlined">
      <CardActionArea onClick={onOpen}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {project.name}
              </Typography>
              <Chip
                label={project.mode === "live" ? "실시간" : "업로드"}
                size="small"
                color={project.mode === "live" ? "primary" : "secondary"}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              최근 업데이트: {updated_at}
            </Typography>
            <Box sx={{ height: 4, borderRadius: 1, background: "#f0f2f6" }} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
