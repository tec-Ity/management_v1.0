import React from "react";
import moment from "moment";
import CusH6 from "../../../component/typography/CusH6";
import { Grid, Typography } from "@mui/material";
import CusCardDS from "../../../component/card/CusCardDS";
import OrderCard from "../../order/component/OrderCard.jsx";

export default function ClientDetailUI({ obj, orders, handleClick }) {
  const [selObj, setSelObj] = React.useState("");
  return (
    <Grid container sx={{ position: "relative", "&>div": { pb: 3 } }}>
      <Grid item xs={3}>
        <CusH6>{obj.nome}</CusH6>
      </Grid>
      <Grid item xs={6}>
        <Grid>
          <Typography variant="body2">手机号: {obj.phone}</Typography>
        </Grid>
        <Grid>注册时间: {moment(obj.at_crt).format("Do MMM YYYY HH:mm")}</Grid>
      </Grid>
      <Grid item xs={3}>
        <CusH6>余额 0.00</CusH6>
      </Grid>
      <Grid item xs={3}>
        <CusH6>折扣</CusH6>
      </Grid>
      <Grid item xs={9}>
        <CusH6></CusH6>
      </Grid>
      <Grid item xs={3}>
        <CusH6>备注</CusH6>
      </Grid>
      <Grid item xs={9}>
        <Typography></Typography>
      </Grid>
      <Grid item xs={12}>
        <CusH6>历史订单</CusH6>
      </Grid>
      {orders?.map((order) => (
        <Grid key={order._id} item xs={12}>
          <CusCardDS
            busType={"sale"}
            onClick={() => {
              handleClick(order);
              setSelObj(order._id);
            }}
            selected={selObj === order._id}
          >
            <OrderCard obj={order} />
          </CusCardDS>
        </Grid>
      ))}
    </Grid>
  );
}
