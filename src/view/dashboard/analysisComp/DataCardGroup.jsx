import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function DataCardGroup({ size, isMB, dataObjs, analysisData }) {
  const small = size === "small";
  // console.log(dataObjs, analysisData);
  const { t } = useTranslation();
  return dataObjs?.map((obj, index) => {
    const { label, dataField, renderData } = obj;
    let data = analysisData && analysisData[dataField];
    if (renderData) data = renderData(data); //custom data
    return (
      <Grid key={label + index} item xs={4} md={3} xl={2}>
        <Card
          sx={{
            height: { xs: small ? 90 : 110, md: small ? 110 : 150 },
            width: { xs: "100%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              variant={isMB ? "body1" : "h6"}
              textAlign="center"
              sx={{ pb: 2 }}
              color="custom.primary"
            >
              {t(label)}
            </Typography>
            <Typography
              variant={isMB ? "h6" : "h5"}
              textAlign="center"
              color="custom.primary"
            >
              {data || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  });
}
