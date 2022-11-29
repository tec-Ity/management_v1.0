import React from "react";
import { Box, CircularProgress, Dialog, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LoadingModal({ open }) {
  const { t } = useTranslation();

  return (
    <Dialog open={open}>
      <Box
        sx={{
          display: "flex",
          height: 100,
          width: 300,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }} variant="h6" color="custom.primary">
          {t("general.loading")}...
        </Typography>
      </Box>
    </Dialog>
  );
}
