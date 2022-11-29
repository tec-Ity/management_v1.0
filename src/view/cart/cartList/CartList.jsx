import React, { Fragment, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Divider,
  ClickAwayListener,
  Tooltip,
} from "@mui/material";
import CusH6 from "../../../component/typography/CusH6";
import getPrice from "../../../utils/price/getPrice";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { initCart, setCartGoodsPrice } from "../reducer/cartSlice";
import prodImg from "../../../assets/icons/prodImg.png";
import { useEffect } from "react";
import Input from "../../../component/input/Input";
import { t } from "i18next";
import ShadowBoxUI from "./component/ShadowBoxUI";

const textLineStyle = {
  textDecoration: "line-through",
  textDecorationColor: "custom.error",
  color: "custom.primaryLight",
};
const LightCusH6 = (props) => <CusH6 {...props} fontWeight={400} />;

export default function CartList({
  busType,
  curCart,
  handleItemPut,
  handleItemDelete,
  fullWidth = true,
  showImg,
  isMB,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeRow, setActiveRow] = useState({
    index: null,
    max: curCart.OrderProds?.length,
  });
  const [activeField, setActiveField] = useState(null);
  const [editingGoodsPrice, setEditingGoodsPrice] = useState(false);
  //init 0, prevent 1, ready 2
  const [mobileClickCount, setMobileClickCount] = useState(0);
  const [goodsPriceTemp, setGoodsPriceTemp] = useState(curCart.goodsPrice);
  const listenerRef = React.useRef(null);
  // console.log(activeField);
  // console.log(activeRow.index);

  let rowIndex = -1;
  let maxRowIndex = 0;

  const handleSetActiveRow = (index) => (val) => {
    // console.log(index, val, mobileClickCount);
    if (!isMB) {
      if (val && !activeRow.index) {
        setActiveRow((prev) => ({ ...prev, index }));
      } else setActiveRow((prev) => ({ ...prev, index }));
    } else {
      if (val) {
        if (mobileClickCount === 0 || mobileClickCount === 2) {
          setActiveRow((prev) => ({ ...prev, index }));
        } else setMobileClickCount(2);
      } else {
        setActiveRow((prev) => ({ ...prev, index: null }));
        setMobileClickCount(1);
      }
    }
  };

  //update cart total rows number
  useEffect(() => {
    if (curCart?.OrderProds?.length > 0) {
      let rows = 0;
      curCart.OrderProds.forEach((op) => {
        if (op.is_simple) rows += 1;
        else
          op.OrderSkus?.forEach((osku) => {
            rows += 1;
          });
      });
      setActiveRow((prev) => ({ ...prev, max: rows }));
    }
  }, [curCart?.OrderProds]);

  //arrow key to move
  useEffect(() => {
    const refCurrent = listenerRef.current;
    const handleKeyDown = (e) => {
      let matchCode = true;
      const currentFocused = document.activeElement === refCurrent;
      // console.log("list listener");
      switch (e.code) {
        case "ArrowUp":
          setActiveRow((prev) => ({
            ...prev,
            index: prev.index > 0 ? prev.index - 1 : 0,
          }));
          break;
        case "ArrowDown":
          setActiveRow((prev) => ({
            ...prev,
            index: prev.index < prev.max - 1 ? prev.index + 1 : prev.index,
          }));
          break;
        case "ArrowLeft":
          setActiveField("quantity");
          break;
        case "ArrowRight":
          setActiveField("price");
          break;
        case "Enter":
        case "NumpadEnter":
          refCurrent.focus();
          matchCode = false;
          break;
        case "Escape":
          e.preventDefault();
          // console.log(11111, document.activeElement);
          if (currentFocused) {
            setActiveRow((prev) => ({ ...prev, index: null }));
            refCurrent.blur();
          } else {
            setActiveField(null);
            refCurrent.focus();
          }
          break;
        default:
          matchCode = false;
          break;
      }
      matchCode && e.preventDefault();
    };
    refCurrent.addEventListener("keydown", handleKeyDown);
    return () => {
      refCurrent.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const refCurrent = listenerRef.current;
    const handleStartActiveOnKeyDown = (e) => {
      // console.log(999999);
      if (e.code === "ArrowDown") {
        refCurrent.focus();
        setActiveRow((prev) => ({ ...prev, index: 0 }));
      }
    };
    if (activeRow.index === null) {
      console.log("start");
      window.addEventListener("keydown", handleStartActiveOnKeyDown, {
        once: false,
      });
    } else window.removeEventListener("keydown", handleStartActiveOnKeyDown);
    return () =>
      window.removeEventListener("keydown", handleStartActiveOnKeyDown);
  }, [activeRow.index]);
  // console.log(activeRow);

  return (
    <Grid container>
      {/* header */}
      <Grid
        container
        item
        xs={12}
        sx={{
          mb: { xs: 0, md: 2 },
          boxSizing: "border-box",
        }}
      >
        <Grid
          item
          xs={4}
          container
          sx={{
            flexDirection: { xs: "column", md: fullWidth && "row" },
          }}
          justifyContent="center"
          alignItems="center"
        >
          <CusH6 type="standard" sx={{ pr: 1 }}>
            {t("cart.totalItems")}
          </CusH6>
          <CusH6 type={busType}>{curCart.totItem}</CusH6>
        </Grid>
        <Grid
          container
          item
          xs={5}
          justifyContent="center"
          alignItems="center"
          sx={{
            borderLeft: "3px solid",
            borderRight: "3px solid",
            borderColor: `${busType}Mid.main`,
            pl: 1,
            flexDirection: { xs: "column", md: fullWidth && "row" },
          }}
        >
          <CusH6 type="standard" sx={{ pr: 1 }}>
            {t("cart.totalPrice")}
          </CusH6>
          {editingGoodsPrice ? (
            <CartInput
              label={t("cart.totalPrice")}
              isMB={isMB}
              startAdornment={"€"}
              value={goodsPriceTemp ?? curCart.goodsPrice}
              handleOnChange={(value) => setGoodsPriceTemp(value)}
              handleOnBlur={() => {
                dispatch(setCartGoodsPrice(goodsPriceTemp));
                setEditingGoodsPrice(false);
              }}
              handleOnKeyDown={(e) => {
                // console.log(e.code);
                if (e.code === "Escape") {
                  setGoodsPriceTemp(curCart.goodsPrice);
                  setEditingGoodsPrice(false);
                } else if (e.code === "Enter" || e.code === "NumpadEnter") {
                  dispatch(setCartGoodsPrice(goodsPriceTemp));
                  setEditingGoodsPrice(false);
                }
              }}
            />
          ) : (
            <CusH6
              type={busType}
              //  onClick={() => setEditingGoodsPrice(true)}
            >
              {getPrice(curCart.goodsPrice)}
            </CusH6>
          )}
        </Grid>
        <Grid item xs={3} container justifyContent="center" alignItems="center">
          <Button
            size={isMB ? "small" : "medium"}
            variant="outlined"
            color="error"
            sx={{ height: 40 }}
            // startIcon={}
            onClick={() =>
              dispatch(initCart({ type: curCart.type, overRide: true }))
            }
          >
            <DeleteIcon />
            {!isMB && "清空"}
          </Button>
        </Grid>
      </Grid>
      {/* list */}
      <Grid
        item
        container
        xs={12}
        alignContent="flex-start"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          top: { xs: 75, md: 85 },
          overflowY: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
          px: 1,
        }}
      >
        <ClickAwayListener
          onClickAway={() => {
            setMobileClickCount(0);
            setActiveRow((prev) => ({ ...prev, index: null }));
          }}
        >
          <Grid
            container
            item
            xs={12}
            tabIndex="-1"
            ref={listenerRef}
            sx={{ "&:focus": { outline: "none" } }}
          >
            {curCart.OrderProds?.map((op) => {
              if (op.is_simple) {
                rowIndex += 1;
                return (
                  <CartRow
                    key={op.Prod}
                    // fontWeight={400}
                    showImg={showImg}
                    busType={busType}
                    fullWidth={fullWidth}
                    item={op}
                    handleItemPut={(quantity, price) =>
                      handleItemPut(op.Prod, null, quantity, price)()
                    }
                    handleItemDelete={() => handleItemDelete(op.Prod)()}
                    isActive={activeRow.index === rowIndex}
                    setActive={handleSetActiveRow(rowIndex)}
                    activeField={activeField}
                    switchActiveField={(val) => setActiveField(val)}
                  />
                );
              } else {
                return (
                  <Fragment key={op.Prod}>
                    <Grid
                      container
                      item
                      xs={fullWidth ? 5 : 12}
                      sx={{ pt: !fullWidth && { xs: 1, md: 2 } }}
                    >
                      {!op.nomeTR && (
                        <LightCusH6 type="standard" sx={{ maxWidth: "46%" }}>
                          {op.code}&nbsp;/&nbsp;
                        </LightCusH6>
                      )}
                      <LightCusH6 type="standard" sx={{ maxWidth: "46%" }}>
                        {op.nome}
                      </LightCusH6>
                      {op.nomeTR && (
                        <>
                          <LightCusH6 type="standard">&nbsp;/&nbsp;</LightCusH6>
                          <LightCusH6 type="standard" sx={{ maxWidth: "47%" }}>
                            {op.nomeTR}
                          </LightCusH6>
                        </>
                      )}
                    </Grid>
                    {op.OrderSkus?.map((os) => {
                      rowIndex += 1;
                      return (
                        <CartRow
                          key={os.Sku}
                          item={os}
                          isSku
                          handleItemPut={(quantity, price) =>
                            handleItemPut(op.Prod, os.Sku, quantity, price)()
                          }
                          handleItemDelete={() =>
                            handleItemDelete(op.Prod, os.Sku)()
                          }
                          isActive={activeRow.index === rowIndex}
                          activeField={activeField}
                          switchActiveField={(val) => setActiveField(val)}
                          setActive={handleSetActiveRow(rowIndex)}
                        />
                      );
                    })}
                  </Fragment>
                );
              }
            })}
          </Grid>
        </ClickAwayListener>
      </Grid>
    </Grid>
  );
}

const CartRowGroup = ({
  op,
  handleItemPut,
  handleItemDelete,
  activeRow,
  setActiveRow,
}) => {
  const [activeSkuRow, setActiveSkuRow] = useState(null);

  return (
    <Grid container item xs={12}>
      <Grid container item xs={12} sx={{ pt: 2 }}>
        <CusH6
          color={1}
          fontWeight={400}
          sx={{ width: "fit-content", maxWidth: "47%" }}
        >
          {op.nome}
        </CusH6>
        <CusH6 color={1} fontWeight={400}>
          &nbsp;/&nbsp;
        </CusH6>
        <CusH6
          color={1}
          fontWeight={400}
          sx={{ width: "fit-content", maxWidth: "47%" }}
        >
          {op.nomeTR}
        </CusH6>
      </Grid>
      {op.OrderSkus?.map((os) => (
        <CartRow
          key={os.Sku}
          item={os}
          isSku
          handleItemPut={(quantity, price) =>
            handleItemPut(op.Prod, os.Sku, quantity, price)()
          }
          handleItemDelete={() => handleItemDelete(op.Prod, os.Sku)()}
          activeRow={activeRow && activeSkuRow === os.Sku}
          setActiveRow={(val) => {
            if (val) {
              setActiveRow(true);
              setActiveSkuRow(os.Sku);
            } else {
              setActiveSkuRow(null);
            }
          }}
        />
      ))}
    </Grid>
  );
};

const CartRow = ({
  busType,
  item,
  unit,
  isSku = false,
  handleItemPut,
  handleItemDelete,
  isActive,
  setActive,
  activeField,
  switchActiveField,
  fullWidth,
  showImg = false,
}) => {
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  // const [activeField, switchActiveField] = useState(null);
  const DNS = useSelector((state) => state.auth.DNS);
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";

  const handleUpdateItem = (quantity, price) => {
    console.log(quantity, price);
    let newQuantity = quantity,
      newPrice = price;
    // console.log(price, quantity);
    if (price || quantity) {
      if (price) {
        if (typeof price === "string" && price.includes(","))
          newPrice = price.replace(",", ".");
        newPrice = parseFloat(price);
      }
      if (quantity) {
        if (isNaN(parseInt(quantity))) newQuantity = null;
      }

      handleItemPut(newQuantity, newPrice);
    }
  };

  const handleOnKeyDown = (e) => {
    // console.log(11111);
    switch (e.code) {
      case "Escape":
        //noop, auto blur by list listener
        e.preventDefault();
        // console.log(22222);
        // setPrice(item.price);
        // setQuantity(item.quantity);
        // handleUpdateItem(item.quantity, item.price);
        // switchActiveField(null);
        break;
      case "Enter":
      case "NumpadEnter":
        //    handleUpdateItem(quantity, price);
        // switchActiveField(null);
        break;
      // case "ArrowUp":
      //   e.target.blur();
      //   break;
      // case "ArrowDown":
      //   e.target.blur();
      //   break;
      // case "ArrowLeft":
      //   console.log(22222);
      //   e.target.blur();
      //   switchActiveField("price");
      //   break;
      // case "ArrowRight":
      //   console.log(22222);
      //   e.target.blur();
      //   switchActiveField("quantity");
      //   break;

      default:
        break;
    }
  };

  const handleOnChange = (field) => (value) => {
    if (field === "price") {
      if (value && (!isNaN(value) || !isNaN(value.replace(",", ".")))) {
        setPrice(value);
      } else setPrice("");
    } else if (field === "quantity") {
      if (value && (parseInt(value) || value === "-")) {
        setQuantity(parseInt(value) || "-");
      } else setQuantity("");
    }
  };

  const handleInputBlur = (e) => {
    console.log(11111, "cartInput onblur", price, quantity);
    if (e) {
      handleUpdateItem(quantity, price);
      switchActiveField(null);
    }
  };

  const handleOnFinish = (field) => (value) => {
    console.log("onFinish", field, value);
    const priceTemp =
      field === "price" && !isNaN(parseFloat(value)) ? value : price;
    const quantityTemp =
      field === "quantity" && !isNaN(parseFloat(value)) ? value : quantity;
    handleUpdateItem(quantityTemp, priceTemp);
    switchActiveField(null);
  };
  // useEffect(() => {
  //   !isActive&&
  // }, [])

  // console.log(activeField);
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (activeField) {
          handleUpdateItem(quantity, price);
          // switchActiveField(null);
        }
        isActive && setActive(null);
      }}
    >
      <Grid
        container
        item
        xs={12}
        sx={{
          position: "relative",
          cursor: "default",
        }}
        onClick={() => {
          !isActive && setActive(true);
        }}
      >
        <ShadowBoxUI
          fullWidth={fullWidth}
          isActive={isActive}
          // showCancel={isMB}
          handleItemDelete={handleItemDelete}
          handleCancel={(e) => {
            e.stopPropagation();
            // switchActiveField(null);
            // setActive(null);
          }}
        />
        <Grid
          container
          item
          xs={12}
          justifyContent="center"
          alignItems="center"
          sx={{
            fontSize: "20px",
            zIndex: 1,
          }}
        >
          {showImg && (
            <Grid item xs={2}>
              <img
                src={item.img_xs ? DNS + item.img_xs : prodImg}
                alt=""
                style={{
                  width: "100%",
                  objectFit: "scale-down",
                  height: 50,
                }}
              />
            </Grid>
          )}
          <Grid container item xs={showImg ? 10 : 12}>
            {isSku ? (
              <>
                <Grid item xs={1} />
                <Grid item container xs={11} sx={{ py: 1 }}>
                  <Typography>--&nbsp;</Typography>
                  {typeof item.attrs === "string" ? (
                    <Typography fontWeight={700} sx={{ pr: 1 }}>
                      {item.attrs}
                    </Typography>
                  ) : (
                    item.attrs?.map((attr) => (
                      <Typography
                        fontWeight={700}
                        sx={{ pr: 1 }}
                        key={attr.nome}
                      >
                        {attr.nome}:{attr.option}
                      </Typography>
                    ))
                  )}
                </Grid>
              </>
            ) : (
              // code & nome section
              <Grid
                container
                item
                xs={fullWidth ? 6 : 12}
                sx={{ pt: !fullWidth && { xs: 1, md: 2 } }}
              >
                <LightCusH6
                  type="standard"
                  sx={{
                    display: { xs: "inherit", md: "none" },
                    maxWidth: "46%",
                  }}
                >
                  {item.codeSup || item.code}&nbsp;/&nbsp;
                </LightCusH6>
                <Tooltip
                  title={
                    <>
                      <Typography>编号: {item.code}</Typography>
                      <Typography>名称: {item.nome}</Typography>
                      {item.nomeTR && (
                        <Typography>别名: {item.nomeTR}</Typography>
                      )}
                    </>
                  }
                  placement="right-start"
                  arrow
                  sx={{ display: { xs: "none", md: "inherit" } }}
                >
                  <Typography
                    variant="h6"
                    textOverflow="ellipsis"
                    noWrap
                    sx={{ maxWidth: { xs: "46%", md: "100%" } }}
                  >
                    {item.nome}
                  </Typography>
                  {/* <LightCusH6
                    type="standard"
                    disableTitle={!isMB}
                    sx={{ maxWidth: { xs: "46%", md: "100%" } }}
                  >
                    {item.nome}
                  </LightCusH6> */}
                </Tooltip>
              </Grid>
            )}
            {!isMB && !fullWidth && <Grid item xs={1}></Grid>}
            {/* ---------------- quantity */}
            <Grid item xs={fullWidth ? 1.5 : 4}>
              {isActive && activeField === "quantity" ? (
                <CartInput
                  label={t("cart.quantity")}
                  isMB={isMB}
                  busType={busType}
                  value={quantity ?? item.quantity}
                  startAdornment={<Box sx={{ pr: 1 }}>x</Box>}
                  handleOnKeyDown={handleOnKeyDown}
                  handleOnBlur={handleInputBlur}
                  handleOnFinish={handleOnFinish("quantity")}
                  handleOnChange={handleOnChange("quantity")}
                />
              ) : (
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={(e) => {
                    switchActiveField("quantity");
                  }}
                >
                  <LightCusH6
                    type={busType}
                    frontIcon={
                      <Box component="span" sx={{ px: 1, display: "inline" }}>
                        x
                      </Box>
                    }
                  >
                    {item.quantity +
                      (item.unit && item.unit != "undefined"
                        ? item.unit
                        : "件")}
                  </LightCusH6>
                </Box>
              )}
            </Grid>
            {/* ---------------- price */}
            <Grid item xs={fullWidth ? 2.5 : 4}>
              {isActive && activeField === "price" ? (
                <CartInput
                  label={t("cart.price")}
                  isMB={isMB}
                  busType={busType}
                  value={price ?? item.price}
                  startAdornment={"€"}
                  handleOnKeyDown={handleOnKeyDown}
                  handleOnBlur={handleInputBlur}
                  handleOnFinish={handleOnFinish("price")}
                  handleOnChange={handleOnChange("price")}
                  keyboardProps={{
                    discountProps: {
                      enableDiscount: true,
                      defaultPrice: item.priceBase,
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{ cursor: "pointer", display: "flex" }}
                  onClick={(e) => {
                    switchActiveField("price");
                  }}
                >
                  <LightCusH6
                    type={busType}
                    sx={{
                      ...(item.price !== item.priceBase
                        ? {
                            ...textLineStyle,
                            display: isMB ? "none" : "visible",
                          }
                        : {}),
                      pl: 1,
                    }}
                  >
                    {getPrice(item.priceBase)}
                  </LightCusH6>
                  {item.price !== item.priceBase && (
                    <LightCusH6 type="error" sx={{ pl: 1 }}>
                      {getPrice(item.price)}
                    </LightCusH6>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item xs={fullWidth ? 2 : isMB ? 4 : 3}>
              <LightCusH6 type="standard">
                {getPrice(item.price * item.quantity)}
              </LightCusH6>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </ClickAwayListener>
  );
};

const CartInput = ({
  busType,
  value,
  startAdornment,
  handleOnChange,
  handleOnFinish,
  handleOnKeyDown,
  handleOnBlur,
  isMB,
  discount = false,
  label,
  keyboardProps,
}) => {
  return (
    <Input
      variant="standard"
      initShowKeyboard
      size="small"
      autoFocus
      onFocus={(e) => {
        e.target.select();
      }}
      sx={{ width: "80%" }}
      inputProps={{ sx: { padding: 0 }, type: isMB ? "number" : "text" }}
      InputProps={{
        sx: { "&::after": { borderColor: `${busType}Mid.main` } },
        startAdornment,
      }}
      value={value}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onBlur={handleOnBlur}
      onFinish={handleOnFinish}
      keyboardProps={{ ...keyboardProps, startAdornment, title: label }}
    />
  );
};
