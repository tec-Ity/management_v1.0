import React, { useEffect } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from "./router/Router";
import Navigation from "./view/global/Navigation";
import { Container } from "@mui/material";
// import { theme } from "./theme/index";
// import { theme as hfcTheme, danger as hfcDanger } from "./theme/hekFanChai";
import { theme } from "./theme/holartec";
import { ThemeProvider } from "@mui/material";
import ProdStorage from "./view/_prodStorage/ProdStorage";
import "./utils/language/i18n";
import { createTheme } from "@mui/material";
import * as locales from "@mui/material/locale";

import AuthGate from "./view/global/AuthGate";
import MobileListener from "./utils/mobileListener/MobileListener";

export default function App() {
  const [locale, setLocale] = React.useState("zhCN");

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale]
  );

  useEffect(() => {
    window.electron?.windowApi?.closeLoadingWindow();
    window.electron?.updateApi?.getMessage();
    window.electron?.updateApi?.getDownloadProgress();
    window.electron?.updateApi?.alertUpdate();
    window.electron?.updateApi?.checkUpdate();
  }, []);

  return (
    <MobileListener>
      <ThemeProvider theme={themeWithLocale}>
        <Container
          id="mainContainer"
          maxWidth={false}
          disableGutters
          sx={{
            backgroundColor: { xs: "custom.gray", md: "custom.primary" },
            height: "100vh",
            position: "fixed",
            // top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          {/* <div style={{ color: "white" }}>xxxxxxxxxxxxxxx</div> */}
          <HashRouter>
            <AuthGate>
              <Navigation />
              <Container
                maxWidth={false}
                sx={{
                  position: "relative",
                  height: "calc(100vh - 70px)",
                  borderRadius: "30px 30px 0 0",
                  overflowY: "scroll",
                  "&::-webkit-scrollbar": { display: "none" },
                  backgroundColor: "custom.gray",
                  px: { xs: 1, md: 2 },
                }}
              >
                <Router />
              </Container>
            </AuthGate>
          </HashRouter>
          {/* <ProdStorage /> */}
        </Container>
      </ThemeProvider>
    </MobileListener>
  );
}
