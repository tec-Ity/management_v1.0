import React from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Card,
  CardActionArea,
  Grid,
  Link,
  Typography,
  Button,
} from "@mui/material";
import { t } from "i18next";
const settingObjsBack = ["coin", "paidType", "shop", "record"];
const settingObjsFront = [];

export default function SettingPage({ type }) {
  const settingObjs = type === 1 ? settingObjsFront : settingObjsBack;

  return (
    <Grid container rowSpacing={3} sx={{ pt: 3 }}>
      {settingObjs.map((setting) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={setting}>
          <Card
            sx={{
              height: { xs: 100, md: 200 },
              width: { xs: "100%", md: 200 },
              borderRadius: "20px",
            }}
          >
            <Link
              component={RouterLink}
              to={setting}
              sx={{ height: "100%", width: "100%" }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={700} variant="h6">
                  {t(`nav.${setting}`)}
                </Typography>
              </CardActionArea>
            </Link>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
