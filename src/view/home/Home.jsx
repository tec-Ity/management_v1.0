import React from "react";
import nav_dashboard from "../../assets/nav-analysis.png";
import nav_prods from "../../assets/nav-prods.png";
import nav_orders from "../../assets/nav-orders.png";
import nav_purOrders from "../../assets/nav-purOrders.png";
import nav_clients from "../../assets/nav-clients.png";
import nav_suppliers from "../../assets/nav-suppliers.png";
import nav_users from "../../assets/nav-users.png";
import nav_settings from "../../assets/nav-settings.png";
import nav_homePage from "../../assets/nav-dashboard.png";
import HLT_LOGO from "../../assets/logo/Holartec_Logo_green.png";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import AuthNav from "../global/AuthNav";
import { useLocation, useNavigate } from "react-router-dom";
import { t } from "i18next";

const nav_icons = {
  nav_dashboard,
  nav_prods,
  nav_orders,
  nav_purOrders,
  nav_clients,
  nav_users,
  nav_settings,
  nav_suppliers,
  nav_homePage,
};
export default function Home() {
  const navigate = useNavigate();
  const hide_clients = useSelector(
    (state) => state.auth?.userInfo?.Shop?.cassa_auth?.hide_clients
  );
  const navis = useSelector((state) => state.root.navis);
  const navi = navis.back;
  const hideLinks = ["homePage", ...(hide_clients ? ["clients"] : [])];
  return (
    <Container sx={{ bgcolor: "#fff", height: "90vh" }}>
      <Box>
        {/* <Logo sx={{ mx: 2.5, my: 3 }} /> */}
        <Box
          component="img"
          src={HLT_LOGO}
          sx={{ width: "90%", height: 50, objectFit: "scale-down", my: 2 }}
        />

        <Grid
          container
          justifyContent="space-between"
          sx={{
            position: "relative",
            bgcolor: "saleLight.main",
            borderRadius: "20px",
          }}
        >
          {navi?.navs?.links?.map(
            (nav) =>
              nav.showMB !== false && (
                <AuthNav
                  key={nav.to}
                  userRoles={nav.role}
                  link={nav.to}
                  hideLinks={hideLinks}
                >
                  <Grid
                    container
                    item
                    xs={4}
                    sm={3}
                    md={2}
                    lg={1.5}
                    key={nav.to}
                    // flexDirection="column"
                    justifyContent="cetner"
                    alignItems="center"
                    sx={{
                      boxSizing: "border-box",
                      p: 4,
                      position: "relative",
                      border: "0.5px solid #fff",
                    }}
                  >
                    <Box
                      component="img"
                      src={nav_icons[`nav_${nav.label}`]}
                      alt={nav.label}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "scale-down",
                      }}
                      onClick={() => navigate(navi?.navs?.base + "/" + nav.to)}
                    />
                    <Typography
                      sx={{
                        m: "auto",
                      }}
                    >
                      {t(`nav.${nav.label}`)}
                    </Typography>
                    {/* <Box
                      sx={{
                        position: "absolute",
                        left: 10,
                        top: 30,
                        right: 10,
                        bottom: 0,
                        zIndex: -1,
                        borderRadius: "10px",
                        bgcolor: "primary.main",
                      }}
                    /> */}
                  </Grid>
                </AuthNav>
              )
          )}
          {/* <Grid
            container
            sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          >
            {([...Array()])}
          </Grid> */}
        </Grid>
      </Box>
    </Container>
  );
}
