import React from "react";
import { useSelector } from "react-redux";
import FrontMB from "../@frontMobile/FrontMB";
import CartPage from "../cart/CartPage";

export default function Purchase() {
  const view = useSelector((state) => state.root.view);
  if (view === "MB") return <FrontMB type={1} />;
  return (
    <CartPage
      type={1}
      // isInit={false}
    />
  );
}
