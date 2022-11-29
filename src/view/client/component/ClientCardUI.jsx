import React from "react";
import moment from "moment";
//comp
import CusH6 from "../../../component/typography/CusH6";
//mui
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ClientCardUI({ obj, sx, busType }) {
  const { t } = useTranslation();
  return (
    <Grid
      container
      alignContent="flex-start"
      rowGap={0.1}
      sx={{ width: "200px", height: "80px", ...sx }}
    >
      <Grid item xs={12} container justifyContent="space-between">
        <CusH6 type={busType}>{obj.code}</CusH6>
        <CusH6 type={busType}>{obj.nome}</CusH6>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          {" "}
          {t("formField.phone")}: {obj.phone}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          {t("formField.crt_at")}:{" "}
          {moment(obj.at_crt).format("Do MMM YYYY HH:mm")}
        </Typography>
      </Grid>
    </Grid>
  );
}
