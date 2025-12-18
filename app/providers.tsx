"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2a5bd7" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f7f8fb" },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2800}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

