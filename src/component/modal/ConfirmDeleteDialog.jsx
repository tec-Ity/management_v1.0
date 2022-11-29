import React from "react";
import CusDialog from "./CusDialog.jsx";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "@mui/material";

export default function ConfirmDeleteDialog({ open, onClose, handleDelete }) {
  const { t } = useTranslation();
  return (
    <CusDialog
      size="xs"
      title="确认删除？"
      open={open}
      onClose={onClose}
      content={
        <Grid container justifyContent="center">
          <Grid container item xs={6} md={3} justifyContent="center">
            <Button variant="outlined" color="error" onClick={handleDelete}>
              {t("general.delete")}
            </Button>
          </Grid>
          <Grid container item xs={6} md={3} justifyContent="center">
            <Button variant="contained" onClick={onClose}>
              {t("general.cancel")}
            </Button>
          </Grid>
        </Grid>
      }
    />
  );
}
