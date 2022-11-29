import React from "react";
import Container from "@mui/material/Container";

export default function ScrollContainer({ children }) {
  return (
    <Container
      sx={{
        height: "calc(100vh - 70px)",
        overflowY: "scroll",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {children}
    </Container>
  );
}
