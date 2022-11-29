import React from "react";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function CloseButton({ onClick, busType }) {
  return (
    <Button
      variant="outlined"
      color={busType}
      sx={{
        height: 40,
        width: 40,
        // border: "1px solid",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 40,
      }}
      onClick={onClick}
    >
      <CloseIcon />
    </Button>
  );
}
