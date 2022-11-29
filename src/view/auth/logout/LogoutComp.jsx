import React, { useEffect } from "react";
import CusDialog from "../../../component/modal/CusDialog";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { fetchLogout } from "../../../redux/authSlice";
import { t } from "i18next";
import { loginUrl } from "../../../config/general/router/routerConf";
import { handleLogout } from "../../../redux/authSlice";
import { initCart } from "../../cart/reducer/cartSlice";
// import { setIsLogin, setDNS } from "../../../redux/authSlice";
export default function LogoutComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const startLogout = (isClose = false) => {
    console.log("logout");
    const DNS = localStorage.getItem("DNS");
    const settings = localStorage.getItem("settings");
    localStorage.clear();
    if (DNS) {
      localStorage.setItem("DNS", DNS);
      localStorage.setItem("settings", settings);
      // dispatch(setDNS(DNS));
    }
    dispatch(initCart({ overRide: true }));
    dispatch(handleLogout());
    navigate(loginUrl);
    // window.location.reload();
    // window.location.replace(`#${loginUrl}`);
    // window.location.reload();
  };
  useEffect(() => {
    !window.electron?.windowApi && startLogout();
  }, []);

  return window.electron?.windowApi ? (
    <CusDialog
      size="xs"
      open
      onClose={() => {}}
      content={<>是否同时退出系统?</>}
      justifyAction="center"
      actions={[
        {
          label: t("general.confirm"),
          variant: "contained",
          onClick: () => {
            startLogout();
            window.electron?.windowApi?.closeMainWindow();
          },
        },
        {
          label: t("general.no"),
          onClick: () => {
            startLogout();
          },
        },
      ]}
    />
  ) : (
    <></>
  );
}
