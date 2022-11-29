import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loginUrl,
  logoutUrl,
  noAuthUrl,
} from "../../config/general/router/routerConf";
import { fetchDNS, fetchUserInfo } from "../../redux/authSlice";
const SHOP_BOSS_ROLE = 101;
export default function AuthGate({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const DnsStatus = useSelector((state) => state.auth.DnsStatus);
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.userInfo.role);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const { able_MBsell, able_PCsell } =
    useSelector((state) => state.auth.userInfo) || {};
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  //dns gate
  // console.log("------------", location.pathname, location);

  useEffect(() => {
    //*未登录跳转
    //only redirect when not in login/logout page
    if (location.pathname !== loginUrl && location.pathname !== logoutUrl) {
      console.log(1111111111, location.pathname);
      if (!isLogin) navigate(loginUrl);
      else {
        DnsStatus === "idle" && dispatch(fetchDNS());
        DnsStatus === "error" && navigate(logoutUrl);
      }
    }

    //*未授权页面跳转
    if (location.pathname === noAuthUrl) {
      if (userRole <= SHOP_BOSS_ROLE) navigate("/B/dashboard");
    }
  }, [
    dispatch,
    location.pathname,
    DnsStatus,
    navigate,
    isLogin,
    isMB,
    able_MBsell,
    able_PCsell,
    userRole,
  ]);

  //get user info
  useEffect(() => {
    location.pathname !== loginUrl &&
      location.pathname !== logoutUrl &&
      dispatch(fetchUserInfo());
  }, []);

  return children;
}
