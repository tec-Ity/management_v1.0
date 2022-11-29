import React from "react";
import { useSelector } from "react-redux";
const SHOP_BOSS_ROLE = 101;

export default function AuthNav({
  children,
  userRoles,
  link,
  hideLinks,
  section,
}) {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const curRole = useSelector((state) => state.auth.userInfo.role);
  const roleTemp = curRole > SHOP_BOSS_ROLE ? "worker" : "boss";

  if (
    isLogin &&
    userRoles.indexOf(roleTemp) !== -1 &&
    (section === "back" || hideLinks?.indexOf(link) === -1)
  )
    return children;
  else return <></>;
}
