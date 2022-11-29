import React from "react";
//mui
import {
  Box,
  Avatar,
  Divider,
  Grid,
  ListItem,
  Typography,
  Button,
  List,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import FrontNavBtns from "./FrontNavBtns";
import { useNavigate } from "react-router-dom";
import HLT_LOGO from "../../assets/logo/Holartec_Logo_green.png";
import { setSection } from "../../redux/rootSlice";
import {
  fetchProdsUpdate,
  resetUpdateStatus,
} from "../_prodStorage/reducer/ProdStorageSlice";
import SuccessSnackBar from "../../component/popover/SuccessSnackBar.jsx";
export default function FrontAccount({ type = -1 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { able_MBsell } = userInfo?.Shop || {};
  const section = useSelector((state) => state.root.section);
  const navis = useSelector((state) => state.root.navis);
  const view = useSelector((state) => state.root.view);
  const updateStatus = useSelector((state) => state.prodStorage.updateStatus);
  const updateMessage = useSelector((state) => state.prodStorage.updateMessage);
  const toggleSection = (isNavigate = true) => {
    const newSection = section === "front" ? "back" : "front";
    dispatch(setSection(newSection));
    const { navs } = navis[newSection];
    const link =
      navs.base +
      (view === "MB"
        ? navs.defaultLinkMB || navs.defaultLink
        : navs.defaultLink);
    isNavigate && navigate(link);
  };
  const showFrontNavs = userInfo.role <= 101 && able_MBsell;
  console.log(showFrontNavs, userInfo.role, able_MBsell);
  return (
    <>
      <Grid container sx={{ p: 3 }} rowSpacing={3}>
        <Grid item xs={12}>
          <Box
            component="img"
            src={HLT_LOGO}
            sx={{ width: "100%", objectFit: "scale-down" }}
          />
        </Grid>
        <Grid item xs={4}>
          <Avatar sx={{ height: 56, width: 56 }} />
        </Grid>
        <Grid item xs={6} container alignItems="center">
          <Typography>{userInfo.code}</Typography>
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        color="error"
        size="large"
        sx={{
          position: "absolute",
          bottom: 10,
          right: 20,
          left: 20,
          justifyContent: "center",
          borderRadius: "10px",
          mx: -1,
          px: 1,
        }}
        onClick={() => navigate("/logout")}
      >
        <Typography sx={{ pr: 2 }}>登出</Typography>
        <LogoutIcon />
      </Button>
      <SuccessSnackBar
        msg={updateStatus === "succeed" ? updateMessage : ""}
        onClose={() => dispatch(resetUpdateStatus())}
      />
    </>
  );
}
