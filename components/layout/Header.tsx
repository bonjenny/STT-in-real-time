"use client";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, MouseEvent } from "react";

type HeaderProps = {
  onNewProjectClick?: () => void;
};

export default function Header({ onNewProjectClick }: HeaderProps) {
  const [anchor_el, set_anchor_el] = useState<null | HTMLElement>(null);

  const handle_user_menu = (event: MouseEvent<HTMLElement>) => {
    set_anchor_el(event.currentTarget);
  };

  const handle_close = () => {
    set_anchor_el(null);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ px: 3, py: 1.5, borderBottom: "1px solid #e3e6ef" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1b1d29" }}>
          STT Studio
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onNewProjectClick}
          sx={{ mr: 2, textTransform: "none" }}
        >
          새 프로젝트
        </Button>
        <IconButton onClick={handle_user_menu} sx={{ p: 0 }}>
          <Avatar sx={{ width: 36, height: 36 }}>U</Avatar>
        </IconButton>
        <KeyboardArrowDownIcon color="action" sx={{ ml: 0.5 }} />
        <Menu
          anchorEl={anchor_el}
          open={Boolean(anchor_el)}
          onClose={handle_close}
        >
          <MenuItem onClick={handle_close}>마이페이지</MenuItem>
          <MenuItem onClick={handle_close}>설정</MenuItem>
          <MenuItem onClick={handle_close}>로그아웃</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

