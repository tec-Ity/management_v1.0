import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import CusH6 from "../../../component/typography/CusH6";
import getPrice from "../../../utils/price/getPrice";
export default function OrderCard({ obj, isMB, busType }) {
  const {
    is_virtual,
    show_crt,
    Supplier,
    Client,
    is_offline,
    is_storage,
    code,
    is_pass,
    order_sale,
    order_regular,
    order_imp,
    at_crt,
    OrderProds,
    goods_quantity,
    isPaid,
  } = obj || {};
  const subject = obj?.type_Order === 1 ? Supplier : Client;
  const offline = is_offline && is_storage;
  return (
    <Grid
      container
      alignContent="flex-start"
      sx={{
        maxHeight: 200,
        // maxWidth: 500,
        width: { xs: "100%", md: "auto" },
      }}
    >
      <Grid
        container
        item
        xs={12}
        justifyContent="space-between"
        sx={{
          color: "saleMid.main",
          fontWeight: 700,
        }}
      >
        <CusH6 type={is_virtual ? "error" : offline ? "primary" : busType}>
          {code}
          {is_virtual && "(虚拟)"}
          {offline && "(离线)"}
        </CusH6>
        {/* {false ? ( */}
        {is_pass === false || order_sale !== order_regular ? (
          <>
            <CusH6 sx={{ textDecoration: "line-through" }} type="standard">
              {getPrice(order_regular)}
            </CusH6>
            <CusH6 type="error">{getPrice(order_imp)}</CusH6>
          </>
        ) : (
          <CusH6 type={busType}>{getPrice(order_imp)}</CusH6>
        )}
      </Grid>
      <Grid
        container
        item
        xs={12}
        justifyContent="space-between"
        sx={{ color: "custom.primary", pb: 1 }}
      >
        <Typography variant="body2">
          {moment(is_virtual ? show_crt : at_crt).format(
            "MM月DD日YYYY年  HH:mm"
          )}
          {/* {moment(is_virtual ? show_crt : at_crt).format("Do MMM YYYY HH:mm")} */}
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {subject?.nome}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{ height: 70, overflow: "hidden" }}
        alignContent="flex-start"
      >
        {OrderProds?.map((op) => (
          <Grid container item xs={12} key={op._id} sx={{ fontSize: 14 }}>
            <Grid item xs={7} md={5}>
              <Typography noWrap>{op.nome}</Typography>
            </Grid>
            {op.Prod?.is_simple ? (
              <>
                <Grid item xs={3} md={4} textAlign="end">{`${
                  op.quantity
                } x ${getPrice(op.price)}`}</Grid>
                <Grid item xs={2} md={3} textAlign="end">
                  {getPrice(op.quantity * op.price)}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={4} textAlign="end">
                  {op.prod_quantity}
                </Grid>
                {op.OrderSkus?.map((os) => (
                  <Grid container item xs={12} key={os._id}>
                    <Grid item xs={5}>
                      --{os.attrs}
                    </Grid>
                    <Grid item xs={4} textAlign="end">
                      {`${os.quantity} x ${os.price}`}
                    </Grid>
                    <Grid item xs={3} textAlign="end">
                      € {os.quantity * os.price}
                    </Grid>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        ))}
      </Grid>
      <Grid container item xs={12} justifyContent="space-between">
        <Typography
          sx={{
            color: `${busType}Mid.main`,
            fontSize: 14,
          }}
        >{`Total ${goods_quantity} items`}</Typography>
        {!isPaid && (
          <Box
            sx={{
              width: 60,
              height: 25,
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "error.main",
              color: "error.main",
              fontSize: 14,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            未付
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
