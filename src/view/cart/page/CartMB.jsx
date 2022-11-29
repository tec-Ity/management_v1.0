import React from "react";
import CartList from "../cartList/CartList.jsx";
import ProdList from "../prodList/ProdList.jsx";
import PaymentDetail from "../paymentDetail/PaymentDetail.jsx";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  Fab,
  Typography,
} from "@mui/material";
import CusH6 from "../../../component/typography/CusH6.jsx";
import { handleCancelOptionalPayment } from "../reducer/cartSlice.js";
import { useDispatch } from "react-redux";
import { setTabIndex } from "../../../redux/rootSlice";
import getPrice from "../../../utils/price/getPrice";
import SearchIcon from "@mui/icons-material/Search";
export default function CartMB({
  busType,
  type,
  curCart,
  handleSearchProd,
  handleAddProd,
  prodsShow,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
  handleClickMulti,
  searchFocus,
  onSearchFocus,
  buttons,
  section,
  cartPosted,
  orderPostStatus,
}) {
  const dispatch = useDispatch();
  const [showPayment, setShowPayment] = React.useState(false);
  const [prodListSearchFocus, setProdListSearchFocus] = React.useState(true);
  const clientButtonObj = buttons[0];
  const paymentButtonObj = buttons[1];
  const subject = curCart?.subject;
  const { totItem, goodsPrice, OrderProds } = curCart;
  const totType = OrderProds?.length;
  const ua = window.navigator.userAgent.toLocaleLowerCase();
  const isIOS = /iphone|ipad/.test(ua);

  const onPaymentDrawerClose = () => {
    setShowPayment(false);
    dispatch(handleCancelOptionalPayment());
  };

  const handleProdListSearchFocus = () => {
    setProdListSearchFocus(false);
  };

  // close payment modal after payment succeed
  React.useEffect(() => {
    cartPosted && orderPostStatus === "succeed" && setShowPayment(false);
  }, [cartPosted, orderPostStatus]);

  if (section === "prod")
    return (
      <>
        <ProdList
          busType={busType}
          isMB
          type={type}
          handleSearchProd={handleSearchProd}
          handleAddProd={handleAddProd}
          prodsShow={prodsShow}
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
          handleClickMulti={handleClickMulti}
          searchFocus={prodListSearchFocus}
          onSearchFocus={handleProdListSearchFocus}
          curCart={curCart}
          searchAutoFocus={false}
        />
        <Box sx={{ height: 65 }} />
        <Box
          sx={{
            position: "fixed",
            zIndex: 99,
            bgcolor: "custom.gray",
            bottom: 0,
            left: 0,
            right: 0,
            height: 65,
            display: "flex",
            "&>div": {
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // px: 1,
            },
          }}
        >
          <Box sx={{ width: "80%", pl: 1 }}>
            <Button
              color={`${busType}Mid`}
              variant="contained"
              sx={{
                width: "100%",
                height: 50,
                borderRadius: "10px",
                display: "flex",
                p: 1,
                color: "#fff",
              }}
              onClick={() => dispatch(setTabIndex(1))}
            >
              <Typography sx={{ mr: 3 }}>{`${totType || 0}种 / ${
                totItem || 0
              }件`}</Typography>
              <Typography>{`${getPrice(goodsPrice)}`}</Typography>
            </Button>
          </Box>
          <Box sx={{ width: "20%", position: "relative" }}>
            <Fab
              aria-label="searchIcon"
              color="primary"
              sx={{ position: "absolute", bottom: 5, height: 60, width: 60 }}
              onClick={() => setProdListSearchFocus(true)}
            >
              <SearchIcon sx={{ height: 40, width: 40 }} />
            </Fab>
            {/* <Button
              color={`${busType}`}
              variant="contained"
              sx={{
                width: "100%",
                height: 50,
                borderRadius: "10px",
                display: "flex",
                p: 1,
                color: "#fff",
              }}
              // onClick={() => dispatch(setTabIndex(1))}
            >
              搜索
            </Button> */}
          </Box>
        </Box>
      </>
    );
  else if (section === "cart")
    return (
      <>
        <Box
          sx={{ pt: 0.5, position: "relative", height: "calc(100vh - 145px)" }}
        >
          <CartList
            isMB
            showImg
            busType={busType}
            fullWidth={false}
            curCart={curCart}
            handleItemPut={handleItemPut}
            handleItemDelete={handleItemDelete}
          />
        </Box>
        <Box
          sx={{
            position: "fixed",
            zIndex: 99,
            bgcolor: "custom.gray",
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            display: "flex",
            "&>div": {
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
            },
          }}
        >
          <Box sx={{ width: "40%" }}>
            <Button
              variant={subject?.code ? "contained" : "outlined"}
              color={busType + "Mid"}
              sx={{
                width: "100%",
                height: 56,
                borderRadius: "10px",
                display: "flex",
              }}
              onClick={clientButtonObj?.handleClick}
            >
              {!subject?.code && "添加"}
              {clientButtonObj?.label}
              {subject?.code && <>&nbsp;-&nbsp;{subject?.code}</>}
            </Button>
          </Box>
          <Box sx={{ width: "60%" }}>
            <ButtonGroup
              variant="contained"
              color={busType}
              sx={{ width: "100%" }}
              size="large"
            >
              <Button
                sx={{ height: 56, px: 2, width: "50%" }}
                onClick={() => setShowPayment(true)}
              >
                {curCart.isModify ? "修改选项" : "支付选项"}

                {/* <ArrowDropUpIcon /> */}
              </Button>
              <Button
                color={"primary"}
                sx={{ height: 56, px: 2, width: "50%" }}
                disabled={paymentButtonObj?.disabled}
                onClick={paymentButtonObj?.handleClick}
              >
                {/* {paymentButtonObj?.label} */}
                {curCart.isModify ? "确认修改" : "快捷支付"}
              </Button>
            </ButtonGroup>
            <Drawer
              open={showPayment}
              anchor="bottom"
              onClose={onPaymentDrawerClose}
              sx={{
                // height: 400,
                "& .MuiPaper-root": {
                  borderRadius: "20px 20px 0 0",
                },
              }}
            >
              <Box sx={{ minHeight: 500, p: 2 }}>
                <CusH6 type="standard" sx={{ textAlign: "center", mb: 1 }}>
                  支付选项
                </CusH6>
                <PaymentDetail
                  isMB
                  busType={busType}
                  curCart={curCart}
                  type={type}
                  showImp
                  showTax
                  // showShipping
                />
                <Box
                  sx={{
                    display: "flex",
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                  }}
                >
                  <Button
                    size="large"
                    variant="contained"
                    color={busType + "Light"}
                    sx={{ width: "100%" }}
                    disabled={paymentButtonObj?.disabled}
                    onClick={paymentButtonObj?.handleClick}
                  >
                    {curCart.isModify ? "确认修改" : "付款"}
                  </Button>
                  <Button
                    size="large"
                    color="error"
                    variant="outlined"
                    sx={{ width: "100%", ml: 2 }}
                    onClick={onPaymentDrawerClose}
                  >
                    取消
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </Box>
        </Box>
      </>
    );
  else return <></>;
}
