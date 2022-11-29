import React from "react";
import { Card } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function CusAddButton({ handleClick, busType, size = "md" }) {
  const sm = size === "sm";
  return (
    <Card
      onClick={handleClick}
      sx={{
        width: "100%",
        height: sm ? 50 : 80,
        display: "flex",
        cursor: "pointer",
        borderRadius: "10px",
        bgcolor: `${busType}Light.main`,
        opacity: 0.7,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AddRoundedIcon sx={{ height: sm ? 48 : 60, width: sm ? 48 : 60 }} />
    </Card>
  );
}
