import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ShadowBoxUI({
  isActive,
  handleItemDelete,
  fullWidth,
  handleCancel,
  showCancel,
}) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        transition: "opacity 0.3s",
        opacity: isActive ? 1 : 0,
        width: "100%",
        mx: fullWidth && -1,
        px: fullWidth && 1,
        left: 0,
        height: fullWidth ? 35 : { xs: 75, md: 80 },
        position: "absolute",
        borderRadius: "20px",
        bgcolor: "custom.primaryLight",
      }}
    >
      <Box
        sx={{
          zIndex: 2,
          width: 60,
          height: "100%",
          color: "custom.white",
          bgcolor: "error.main",
          position: "absolute",
          right: 0,
          top: 0,
          borderRadius: fullWidth ? "20px" : "0 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={handleItemDelete}
      >
        {t("general.delete")}
      </Box>
      {showCancel && (
        <Box
          sx={{
            zIndex: 2,
            width: 73,
            height: 35,
            color: "custom.white",
            bgcolor: "warning.main",
            position: "absolute",
            right: 0,
            bottom: 0,
            borderRadius: fullWidth ? "20px" : "20px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={handleCancel}
        >
          {t("general.cancel")}
        </Box>
      )}
    </Box>
  );
}
