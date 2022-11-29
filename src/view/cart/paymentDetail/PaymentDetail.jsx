import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  modifyCheck,
  setCartShipping,
  setCartTotPrice,
  setCartVirtual,
  setCurModifyMethod,
  toggleCartIsTax,
  togglePaymentMethod,
  updatePaymentMethodPrice,
} from "../reducer/cartSlice";

//utils
import getPrice from "../../../utils/price/getPrice";

//component
import PadButton from "../../../component/button/PadButton";
import CusH6 from "../../../component/typography/CusH6";

//mui
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import FormCheckBox from "../../../component/form/FormCheckBox";
import { DatePicker } from "@mui/lab";
import FilterDate from "../../../component/filter/FilterDate";
import moment from "moment";
import Input from "../../../component/input/Input";
// import ReplayIcon from "@mui/icons-material/Replay";
import PercentIcon from "@mui/icons-material/Percent";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardModal from "../../../component/keyboard/KeyboardModal";

export default function PaymentDetail({
  isMB,
  busType,
  curCart,
  type,
  showDetail,
  showShipping,
  showTax,
  showChange,
  showImp,
  showVirtual,
}) {
  // console.log(curCart);
  const dispatch = useDispatch();
  const [showDiscountChangeModal, setShowDiscountChangeModal] = useState(false);
  const [showDiscountPercentModal, setShowDiscountPercentModal] =
    useState(false);
  const paymentMethods = useSelector((state) => state.cart.paymentMethods);
  // console.log(paymentMethods);
  const enableMultiPayment = useSelector(
    (state) => state.cart.enableMultiPayment
  );
  const allow_virtualOrder = useSelector(
    (state) => state.auth.userInfo?.Shop?.allow_virtualOrder
  );
  const curModifyMethod = useSelector((state) => state.cart.curModifyMethod);
  const curCoin = useSelector((state) => state.cart.curCoin);
  const {
    is_virtual,
    code,
    show_crt,
    goodsSale,
    goodsPrice,
    subTotPrice,
    totPrice,
    iva,
    isTax,
    totExchange,
    shipping,
    change,
  } = curCart || {};
  //
  const priceDetails = useMemo(() => {
    let discountGoods = goodsSale - goodsPrice;
    let discountTot = subTotPrice - totPrice;
    return [
      // {
      //   label: type === 1 ? "采购单原价" : "订单原价",
      //   color: "custom.primary",
      //   price: curCart.goodsPrice,
      // },
      {
        label: "商品总额",
        color: "custom.primary",
        price: goodsSale,
      },
      {
        label: "商品优惠",
        color: "error.main",
        negative: true,
        show: discountGoods > 0,
        price: discountGoods,
      },
      {
        label: "整单优惠",
        color: "error.main",
        negative: true,
        show: discountTot > 0,
        price: discountTot,
      },
      { label: "税额", color: "custom.primaryMid", price: 0 },
      // { label: "整单优惠", color: "error.main", price: 0, negative: true },
      // { label: "优惠券", color: "error.main", price: 0, negative: true },
    ];
  }, [goodsPrice, goodsSale, subTotPrice, totPrice]);
  // console.log(enableMultiPayment, paymentMethods);
  const BusCusH6 = (props) => <CusH6 {...props} type={busType} />;
  return (
    <Grid container sx={{ width: "100%" }} rowSpacing={1}>
      {showTax && (
        <Grid item container xs={12} alignItems="center">
          <Typography sx={{ mr: 2 }}>开票 + IVA {iva * 100}%</Typography>
          <FormCheckBox
            label=""
            // size="large"
            value={isTax}
            handleChange={() => dispatch(toggleCartIsTax())}
          />
        </Grid>
      )}

      {/* details */}
      {showDetail && (
        <PriceDetailComp
          busType={busType}
          priceDetails={priceDetails}
          totPrice={totPrice}
          totExchange={totExchange}
          curCoin={curCoin}
        />
      )}
      {/* discount section */}
      <Grid container item xs={12} columnSpacing={1} rowSpacing={1}>
        <Grid item xs={12}>
          <Typography variant="body2" color="custom.primary">
            优惠方式 :
          </Typography>
        </Grid>
        {[
          {
            label: "整单折扣",
            icon: <PercentIcon />,
            onClick: () => setShowDiscountChangeModal(true),
            active: subTotPrice !== totPrice,
            component: (
              <TotDiscountChangeComp
                open={showDiscountChangeModal}
                onClose={() => setShowDiscountChangeModal(false)}
                totPrice={totPrice}
                subTotPrice={subTotPrice}
              />
            ),
          },
          // { label: "整单改价", icon: <EditIcon />, onClick: () => {} },
        ].map((obj) => {
          const { label, icon, onClick, component, active } = obj;
          return (
            <Grid item xs={6} key={label}>
              <PadButton
                small
                icon={icon}
                label={label}
                sx={{
                  width: "100%",
                  height: 40,
                  ...(active
                    ? {
                        bgcolor: `${busType}Light.main`,
                      }
                    : {}),
                }}
                textSx={{
                  fontSize: 16,
                  // ...(active
                  //   ? {
                  //       color: "white",
                  //     }
                  //   : {}),
                }}
                handleClick={onClick}
              />
              {component}
            </Grid>
          );
        })}
      </Grid>
      {/* payment types */}
      <Grid container item xs={12} rowSpacing={1}>
        <Grid item xs={12}>
          <Typography variant="body2" color="custom.primary">
            支付方式 :
          </Typography>
        </Grid>

        {paymentMethods.allIds?.map((id) => {
          const method = paymentMethods.byId[id];
          const { field, label, active } = method;
          return (
            <Grid item xs={4} md={null} sx={{ pr: 1 }} key={id}>
              <PadButton
                key={field}
                label={label}
                small
                sx={
                  active && {
                    bgcolor: `${busType}Light.main`,
                  }
                }
                // textSx={
                //   active && {
                //     color: "white",
                //   }
                // }
                handleClick={() => dispatch(togglePaymentMethod(field))}
              />
            </Grid>
          );
        })}
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => dispatch(toggleEnableMultiPayment())}
        >
          <Checkbox
            checked={enableMultiPayment}
            sx={{
              color: "sale.main",
              "&.Mui-checked": {
                color: "sale.main",
              },
              "& .MuiSvgIcon-root": { fontSize: 30 },
            }}
          />
          <Typography variant="caption" color="sale.main">
            组合支付
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => dispatch(resetPayment())}
        >
          <ReplayIcon sx={{ height: 30, width: 30, p: 1 }} />
          <Typography variant="caption" color="sale.main">
            重置支付
          </Typography>
        </Box> 
        */}
      </Grid>
      {/* change section */}
      {showChange && (
        <>
          {paymentMethods.allIds?.map((id) => {
            const method = paymentMethods.byId[id];
            return (
              method.active && (
                <Grid
                  key={id}
                  container
                  item
                  xs={12}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ height: 40, boxSizing: "content-box" }}
                >
                  <Typography fontWeight={700} color={`${busType}Mid.main`}>
                    {method.label}
                  </Typography>
                  {method.is_cash || enableMultiPayment ? (
                    <PaymentInput
                      busType={busType}
                      value={method.price}
                      handleChange={(price) => {
                        console.log(price);
                        dispatch(
                          updatePaymentMethodPrice({
                            field: method.field,
                            price,
                          })
                        );
                      }}
                      errorMsg={method.errorMsg}
                      allowModify={
                        !curModifyMethod || curModifyMethod === method.field
                      }
                      modifying={curModifyMethod === method.field}
                      handleSetModifying={() =>
                        dispatch(setCurModifyMethod(method.field))
                      }
                      handleOnBlur={() => dispatch(modifyCheck(method.field))}
                      symbol={curCoin.symbol}
                    />
                  ) : (
                    <Typography color={`${busType}Mid.main`}>
                      {getPrice(method.price, 2, curCoin.symbol)}
                    </Typography>
                  )}
                </Grid>
              )
            );
          })}
          <Grid item container xs={12} justifyContent="space-between">
            <Typography fontWeight={700} color={`${busType}Mid.main`}>
              找零
            </Typography>
            <Typography color={`${busType}Mid.main`}>
              {getPrice(change, 2, curCoin.symbol)}
            </Typography>
          </Grid>
        </>
      )}
      {/* shipping section */}
      {showShipping && (
        <Grid container item xs={12}>
          <Grid
            container
            item
            xs={12}
            justifyContent="space-between"
            alignItems="center"
            sx={{ pb: { xs: 2, md: 3 }, height: 40, boxSizing: "content-box" }}
          >
            <Typography fontWeight={700} color={`${busType}Mid.main`}>
              运费
            </Typography>
            <PaymentInput
              busType={busType}
              value={shipping}
              handleChange={(price) => dispatch(setCartShipping(price))}
              // errorMsg={}
              allowModify
              symbol={curCoin.symbol}
            />
          </Grid>
        </Grid>
      )}
      {showImp && (
        <PriceDetailComp
          busType={busType}
          priceDetails={priceDetails}
          totPrice={totPrice}
          totExchange={totExchange}
          curCoin={curCoin}
        />
      )}
      {showVirtual && allow_virtualOrder && (
        <Grid
          container
          item
          xs={12}
          sx={{
            mt: 2,
            border: is_virtual && "1px solid",
            borderRadius: "10px",
            borderColor: "primary.main",
            p: is_virtual ? 1 : 0,
            pt: "0 !important",
            boxSizing: "border-box !important",
          }}
          rowSpacing={1}
        >
          <Grid
            container
            item
            xs={12}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={700} color={busType + "Mid.main"}>
              虚拟订单
            </Typography>
            <Checkbox
              checked={is_virtual || false}
              onChange={(e) =>
                dispatch(setCartVirtual({ is_virtual: e.target.checked }))
              }
            />
          </Grid>
          {is_virtual && (
            <>
              <Grid
                container
                item
                xs={12}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={700} color={busType + "Mid.main"}>
                  订单日期
                </Typography>
                <Box sx={{ width: 150 }}>
                  <FilterDate
                    type={"exact"}
                    value={show_crt}
                    handleChange={(val) => {
                      console.log(val);
                      dispatch(
                        setCartVirtual({
                          show_crt: moment(val).format("MM/DD/YYYY"),
                        })
                      );
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                container
                item
                xs={12}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={700} color={busType + "Mid.main"}>
                  订单编号
                </Typography>
                <Input
                  sx={{ width: 150 }}
                  required
                  value={code}
                  onChange={(value) =>
                    dispatch(setCartVirtual({ code: value }))
                  }
                  error={!code}
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Grid>
  );
}

const PaymentInput = ({
  busType,
  value,
  handleChange,
  errorMsg,
  allowModify,
  modifying,
  handleSetModifying,
  handleOnBlur,
  symbol,
  autoFocus = true,
}) => {
  const [price, setPrice] = useState(
    String(parseFloat(value).toFixed(2)).replace(".", ",")
  );
  // const [modifying, setModifying] = useState(false);

  useEffect(() => {
    setPrice(String(parseFloat(value).toFixed(2)).replace(".", ","));
  }, [value]);

  const handleOnChange = (value) => {
    if (allowModify) {
      !modifying && handleSetModifying(true);
      setPrice(value);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      onFinish(price);
    }
  };

  const onFinish = (price) => {
    console.log(price);
    const convertPrice = parseFloat(price.replace(",", "."));
    handleChange(convertPrice);
  };

  return (
    <Input
      autoFocus={autoFocus}
      onFocus={(e) => e.target.select()}
      size="small"
      error={modifying || Boolean(errorMsg)}
      helperText={errorMsg}
      onBlur={() => handleOnBlur && handleOnBlur()}
      value={price ?? value}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onFinish={onFinish}
      sx={{
        width: 140,
        "& .MuiFormHelperText-root ": {
          color: "error.main",
        },
      }}
      inputProps={{ style: { textAlign: "end" }, autoComplete: "off" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Typography
              fontWeight={700}
              color={
                modifying || Boolean(errorMsg)
                  ? "error.main"
                  : `${busType}Mid.main`
              }
            >
              {symbol}
            </Typography>
          </InputAdornment>
        ),
        endAdornment: modifying && (
          <InputAdornment position="end" sx={{ color: "error.main" }}>
            <KeyboardReturnIcon />
          </InputAdornment>
        ),
        sx: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: `${busType}Mid.main`,
            borderRadius: "10px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${busType}Light.main`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "error.main",
            borderWidth: "2px",
          },
        },
      }}
    />
  );
};

const TotDiscountChangeComp = ({ open, onClose, totPrice, subTotPrice }) => {
  const dispatch = useDispatch();
  console.log(totPrice);
  return (
    <KeyboardModal
      open={open}
      onClose={onClose}
      title="整单折扣"
      value={totPrice}
      onChange={(val) => dispatch(setCartTotPrice(val))}
      startAdornment={"€"}
      discountProps={{ enableDiscount: true, defaultPrice: subTotPrice }}
    />
  );
};

const PriceDetailComp = ({
  busType,
  priceDetails,
  totPrice,
  totExchange,
  curCoin,
}) => (
  <>
    <Grid container item xs={12} sx={{ mt: { xs: 2, md: -1 } }}>
      <Grid item xs={12} sx={{ pb: 1, display: { xs: "none", md: "inherit" } }}>
        <CusH6 type={busType}>明细</CusH6>
      </Grid>
      {priceDetails?.map(
        (row) =>
          row.show !== false && (
            <Grid
              key={row.label}
              item
              container
              xs={12}
              justifyContent="space-between"
            >
              <Typography color={row.color}>{row.label}</Typography>
              <Typography color={row.color}>
                {row.negative && "-"}
                {getPrice(row.price)}
              </Typography>
            </Grid>
          )
      )}
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
    <Grid container item xs={12}>
      <Grid container item justifyContent="space-between" xs={12}>
        <CusH6 type={busType}>应收</CusH6>
        <CusH6 type={busType}>{getPrice(totPrice)}</CusH6>
      </Grid>
      {totPrice > 0 && totExchange > 0 && totPrice !== totExchange && (
        <>
          <Grid container item justifyContent="space-between" xs={12}>
            <CusH6 type="standard" sx={{ fontSize: 16 }}>
              汇率
            </CusH6>
            <CusH6 type="standard" sx={{ fontSize: 16 }}>
              1 ：{curCoin.rate}
            </CusH6>
          </Grid>
          <Grid container item justifyContent="space-between" xs={12}>
            <CusH6 type={busType}>折合</CusH6>
            <CusH6 type={busType}>
              {getPrice(totExchange, 2, curCoin.symbol)}
            </CusH6>
          </Grid>
        </>
      )}
    </Grid>
  </>
);
