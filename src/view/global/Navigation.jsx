import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Link,
  Typography,
  Button,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  Tabs,
  Tab,
  Avatar,
  Container,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListIcon from "@mui/icons-material/List";
import PersonIcon from "@mui/icons-material/Person";
import { setDNS } from "../../redux/authSlice";
import ErrorSnackBar from "../../component/popover/ErrorSnackBar";
import SettingsIcon from "@mui/icons-material/Settings";
import CusDialog from "../../component/modal/CusDialog.jsx";
import CusForm from "../../component/form/CusForm.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useTranslation } from "react-i18next";
import { setSection, setTabIndex } from "../../redux/rootSlice";
import HomeIcon from "@mui/icons-material/Home";
import HLT_LOGO from "../../assets/logo/Holartec_Logo_green.png";
import AuthNav from "./AuthNav";
import { homePage } from "../../config/general/router/routerConf";

const curRole = "boss";

const comps = {
  PC: UIPc,
  MB: UIMob,
};

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const _curRole = useSelector((state) => state.auth.userInfo.role);
  const userCode = useSelector((state) => state.auth.userInfo.code);
  const DNS = useSelector((state) => state.auth.DNS);
  const view = useSelector((state) => state.root.view);
  const section = useSelector((state) => state.root.section);
  const navis = useSelector((state) => state.root.navis);
  const able_PCsell = useSelector((state) => state.auth.userInfo?.able_PCsell);
  const hide_clients = useSelector(
    (state) => state.auth?.userInfo?.Shop?.cassa_auth?.hide_clients
  );
  // const curBase = location?.pathname?.split("/")[1];
  //state
  const [authError, setAuthError] = React.useState("");

  // const [section, setSection] = React.useState(
  //   curBase === "B" ? "back" : "front"
  // );
  const [showDNSDialog, setShowDNSDialog] = React.useState(false);
  const UI = comps[view];
  const navi = navis[section];
  const curRoute = location?.pathname?.split("/")[2];
  //auto toggle views
  // useEffect(() => {
  //   const { navs } = navis[section];
  //   const link =
  //     navs.base +
  //     (view === "MB"
  //       ? navs.defaultLinkMB || navs.defaultLink
  //       : navs.defaultLink);
  //   isLogin && navigate(link);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [view]);

  return (
    <>
      <UI
        isLogin={isLogin}
        navi={navi}
        toggleSection={() => {}}
        curRoute={curRoute}
        section={section}
        userCode={userCode}
        _curRole={_curRole}
        setShowDNSDialog={() => setShowDNSDialog(true)}
        able_PCsell={able_PCsell}
        hideLinks={hide_clients ? ["clients"] : []}
      />
      <ErrorSnackBar
        error={authError}
        onClose={() => {
          return setAuthError("");
        }}
      />
      <CusDialog
        open={showDNSDialog}
        onClose={() => setShowDNSDialog(false)}
        title="DNS"
        size="sm"
        content={
          <CusForm
            formInputs={[
              {
                formProps: { gridSizeXl: 12 },
                general: {
                  field: "DNS",
                  rules: {
                    required: true,
                    type: "string",
                  },
                  label: "DNS",
                },
                itemProps: {
                  itemType: "input",
                  type: "text",
                  disabled: false,
                  sx: { width: "100%" },
                },
              },
            ]}
            defaultValue={{ DNS }}
            handleCancel={() => setShowDNSDialog(false)}
            handleSubmit={({ DNS }) => {
              if (DNS) {
                localStorage.setItem("DNS", DNS);
                dispatch(setDNS(DNS));
                setShowDNSDialog(false);
              }
            }}
          />
        }
      />
    </>
  );
}

function UIPc({
  isLogin,
  navi,
  section,
  curRoute,
  userCode,
  _curRole,
  setShowDNSDialog,
  able_PCsell,
  hideLinks,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //! to fixed: change <= to <
  return (
    <Grid container sx={{ height: 70, position: "relative" }}>
      <Grid container item xs={3} justifyContent="center" alignItems="center">
        <Box>
          {/* <Logo /> */}
          {navi.logo ? (
            navi.logo
          ) : (
            <Typography variant="h5" color="custom.white" fontWeight={700}>
              {navi.title}
            </Typography>
          )}
        </Box>
      </Grid>

      <Grid container item xs={9} alignItems="center">
        {isLogin &&
          navi?.navs?.links?.map((nav) => (
            <AuthNav
              key={nav.to}
              userRoles={nav.role}
              curRole={_curRole}
              isLogin={isLogin}
              link={nav.to}
              hideLinks={hideLinks}
              section={section}
            >
              <NavItem
                nav={nav}
                base={navi?.navs?.base}
                selected={curRoute === nav.to}
                section={section}
              />
            </AuthNav>
          ))}
        <Box
          sx={{
            position: "absolute",
            right: "3%",
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography
                sx={{
                  color: "custom.white",
                  width: 100,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                noWrap
                onClick={userCode ? handleClick : () => navigate("/logout")}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                Hi, {userCode ? userCode : "请重新登录"}!
              </Typography>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                // MenuListProps={{
                //   "aria-labelledby": "basic-button",
                // }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: 130,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      left: 30,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/logout");
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  {t("auth.logout")}
                </MenuItem>
                {window.electron && (
                  <MenuItem
                    onClick={() => {
                      window.electron?.windowApi?.closeMainWindow();
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <ListItemIcon>
                      <HighlightOffIcon sx={{ color: "error.main" }} />
                    </ListItemIcon>
                    {t("auth.exit")}
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <Button onClick={setShowDNSDialog} sx={{ color: "custom.white" }}>
              <SettingsIcon />
            </Button>
          )}
        </Box>
        {/* <div>
          <NavItem nav={isLogin ? logoutNav : loginNav} />
        </div> */}
      </Grid>
    </Grid>
  );
}

function UIMob({
  isLogin,
  navi,
  section,
  toggleSection,
  curRoute,
  userCode,
  _curRole,
  setShowDNSDialog,
  hideLinks,
}) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleClick = (event) => {
    navigate("B/account");
  };

  useEffect(() => {
    if (drawerOpen) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curRoute]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const busType = curRoute === "purchase" ? "purchase" : "sale";
  const isCart = navi.isCassa || curRoute === "purchase";

  return isLogin ? (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          bgcolor: isCart ? `${busType}.main` : "custom.primary",
        }}
      />
      <AppBar
        position="static"
        sx={{
          bgcolor: isCart ? `${busType}.main` : "custom.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          {isCart ? (
            <CassaTabs type={curRoute === "purchase" && 1} busType={busType} />
          ) : (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => navigate(homePage)}
              >
                {/* <MenuIcon sx={{ color: "custom.white" }} /> */}
                <HomeIcon sx={{ color: "custom.white" }} />
              </IconButton>
              <Typography
                variant="h6"
                color="custom.white"
                fontWeight={700}
                sx={{ flex: 1 }}
              >
                {t(`nav.${curRoute}`)}
              </Typography>
              <Avatar
                onClick={userCode ? handleClick : () => navigate("/logout")}
                id="basic-button"
                aria-haspopup="true"
              />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  ) : (
    <AppBar position="static" sx={{ bgcolor: "custom.primary" }}>
      <Toolbar>
        <Button onClick={setShowDNSDialog} sx={{ color: "custom.white" }}>
          <SettingsIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
}

const CassaTabs = ({ type = -1 }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tabIndex = useSelector((state) => state.root.tabIndex);
  // const color = type === 1 ? "purchase.main" : "sale.main";
  const color = "custom.white";
  const tabs = [
    {
      label: t(`nav.${type === 1 ? "purchase" : "cart"}`),
      icon: <AddShoppingCartIcon />,
    },
    { label: t(`nav.spCart`), icon: <ShoppingCartIcon /> },
    {
      label: t(`nav.${type === 1 ? "purOrders" : "orders"}`),
      icon: <ListIcon />,
    },
    { label: t(`nav.account`), icon: <PersonIcon /> },
  ];

  return (
    <Tabs
      value={tabIndex}
      onChange={(e, value) => dispatch(setTabIndex(value))}
      aria-label="icon label tabs"
      sx={{
        mb: 1,
        mx: -1,
        "& .MuiTabs-indicator": {
          backgroundColor: color,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.label}
          label={tab.label}
          icon={tab.icon}
          sx={{
            color,
            opacity: 0.8,
            fontSize: 10,
            minHeight: 0,
            "&.Mui-selected": {
              color,
              opacity: 1,
            },
          }}
        />
      ))}
    </Tabs>
  );
};

const NavItemMB = ({ nav, base, selected, section }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <ListItem
      // divider
      button
      onClick={() => navigate(base + "/" + nav.to)}
      selected={selected}
      sx={{ height: 50 }}
    >
      {t(`nav.${nav.label}`)}
    </ListItem>
  );
};
const NavItem = ({ nav, base, selected, section }) => {
  const { t } = useTranslation();
  return (
    <Link
      component={RouterLink}
      to={base + "/" + nav.to}
      sx={{
        color: "custom.white",
        minWidth: 50,
        mx: 1,
        position: "relative",
        fontWeight: 700,
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {t(`nav.${nav.label}`)}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: 10,
          borderRadius: "5px",
          bgcolor: section === "front" ? "sale.main" : "primary.main",
          top: "65%",
          transition: "all 0.3s",
          opacity: selected ? 1 : 0,
        }}
      ></Box>
    </Link>
  );
};
