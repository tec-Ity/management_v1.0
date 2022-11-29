import { Box } from "@mui/material";
import React from "react";

export default function CusCardDS({
  children,
  selected,
  busType = "sale",
  sx,
  isMB,
  onClick = () => {},
}) {
  return (
    <Box
      sx={{
        // height: 200,
        // maxWidth: "100%",
        width: "100%",
        // width: "fit-content",
        filter: (theme) =>
          `drop-shadow(0px ${
            isMB ? "3px 5px" : selected ? "10px 10px" : "0px 10px"
          } ${theme.palette[`${busType}Light`].main})`,
        // `drop-shadow(0px 30px 20px ${`theme.palette.${busType}Light.main`})`,
        boxSizing: "border-box",
        bgcolor: "custom.white",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "0.3s",
        py: { xs: 1, lg: 2 },
        px: { xs: 2, lg: 3 },
        position: "relative",
        opacity: { xs: 1, md: selected ? 1 : 0.5 },
        //left decoration
        "&::before": {
          content: "''",
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          bgcolor: `${busType}Mid.main`,
          width: 10,
          borderRadius: "10px 0 0 10px",
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
