import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
export default function CusCard({
  onClick,
  linkTo = "#",
  target = "_self",
  children,
}) {
  return (
    <Card sx={{ width: { xs: "95vw", md: 300 }, color: "custom.primary" }}>
      <CardActionArea onClick={onClick}>
        {/* <Link
          sx={{ color: "custom.primary" }}
          component={RouterLink}
          to={linkTo}
          underline="none"
          // target={target}
        > */}
        {children}
        {/* </Link> */}
      </CardActionArea>
    </Card>
  );
}
