import { Modal, Paper } from "@mui/material";
import React, { useMemo } from "react";

export default function CusModal({
  open,
  onClose,
  hideBackdrop = false,
  size = "sm",
  direction = "row",
  children,
  sx,
}) {
  const sizes = useMemo(
    () => ({
      xs: { width: { xs: "70%", md: 200 }, height: { xs: 100, md: 100 } },
      sm: { width: { xs: "80%", md: 200 }, height: { xs: 250, md: 100 } },
      md: { width: { xs: "80%", md: 413 }, height: 413 },
      lg: { width: { xs: "100%", md: 800 }, height: { xs: "100%", md: 500 } },
      false: {},
    }),
    []
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: { xs: 1, md: 3 },
          ...sizes[size],
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: direction,
          ...sx,
        }}
      >
        {children}
      </Paper>
    </Modal>
  );
}
