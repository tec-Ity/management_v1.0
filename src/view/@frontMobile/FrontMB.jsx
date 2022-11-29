import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartPage from "../cart/CartPage.jsx";
import OrderList from "../order/list/OrderList.jsx";
import FrontAccount from "./FrontAccount.jsx";

export default function FrontMB({ type = -1 }) {
  const view = useSelector((state) => state.root.view);
  const tabIndex = useSelector((state) => state.root.tabIndex);
  const navigate = useNavigate();
  useEffect(() => view === "PC" && navigate("cart"));
  // console.log(2222222222222, type);
  return (
    <>
      <TabPanel
        value={tabIndex}
        index={tabIndex === 0 || tabIndex === 1 ? tabIndex : 0}
      >
        <CartPage section={tabIndex === 0 ? "prod" : "cart"} type={type} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <OrderList type={type} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <FrontAccount type={type} />
      </TabPanel>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
