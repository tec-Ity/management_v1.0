import { Box } from "@mui/material";
import React from "react";

export default function SlideBox({ show, setShow }) {
  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 10,
        p: 2,
        height: 260,
        width: 600,
        backgroundColor: "custom.primary",
        color: "custom.white",
        borderRadius: "20px",
        boxShadow: "0px 0px 20.5701px rgba(0, 0, 0, 0.1)",
        bottom: show ? 0 : -230,
        transition: "all 0.5s",
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    ></Box>
  );
}
