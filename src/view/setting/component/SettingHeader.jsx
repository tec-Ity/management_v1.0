import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CusH6 from "../../../component/typography/CusH6";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { t } from "i18next";

export default function SettingHeader({ title }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ChevronLeftIcon
        sx={{ height: 40, width: 40 }}
        onClick={() => navigate(-1)}
      />
      <CusH6 color={1}>{t(`nav.${title}`) + "设置"}</CusH6>
      <Box sx={{ width: 46 }} />
    </Box>
  );
}
