import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import getPrice from "../../../utils/price/getPrice";
import { selectProdPrice, selectProdQuantity } from "../reducer/cartSlice";
import ProdControl from "./ProdControl";
import prodImage from "../../../assets/icons/prodImg.png";
export default function ProdRow({
  exactMatched,
  busType,
  type,
  prod,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
  handleClickMulti,
  handleImgClick,
  handleShowInfo,
  focused = false,
  disableControl,
  onClick = () => {},
}) {
  const quantity = useSelector(selectProdQuantity(prod._id));
  const price = useSelector(selectProdPrice(prod._id));
  const [elevation, setElevation] = useState(0);
  const DNS = useSelector((state) => state.auth.DNS);
  const view = useSelector((state) => state.root.view);
  const [showInput, setShowInput] = useState(false);
  const isMB = view === "MB";
  const [selected, setSelected] = useState(focused);
  const prodPrice =
    quantity > 0
      ? getPrice(price) //cart price
      : type === 1
      ? getPrice(prod.price_cost)
      : prod.price_min === prod.price_max //simple sale
      ? getPrice(prod.price_sale)
      : `${getPrice(prod.price_min)} - ${getPrice(prod.price_max)}`;

  const priceText = type === 1 ? "进价" : "卖价";

  const priceColor =
    price && price !== (type === 1 ? prod.price_cost : prod.price_sale) //has cart price with modification
      ? "primary.main"
      : quantity > 0 //has cart price
      ? busType + ".main"
      : "custom.primary";
  return (
    <Card
      elevation={elevation}
      sx={{
        display: "flex",
        width: "100%",
        cursor: "default",
        borderRadius: "10px",
        backgroundColor:
          (selected && quantity > 0) || focused ? "primary.light" : "",
      }}
      onClick={() => {
        setSelected(true);
        onClick({ quantity });
      }}
      onMouseEnter={() => setElevation(10)}
      onMouseLeave={() => setElevation(0)}
      // onClick={
      //   prod?.is_simple
      //     ? quantity === 0
      //       ? handleItemPost(prod)
      //       : () => {}
      //     : handleClickMulti(prod)
      // }
    >
      <CardMedia
        component="img"
        src={prod?.img_xs ? DNS + prod.img_xs : prodImage}
        alt=""
        sx={{
          // p: 1,
          m: 1,
          boxSizing: "border-box",
          height: isMB ? 80 : 100,
          width: isMB ? 80 : 100,
          backgroundColor: "custom.white",
          objectFit: "scale-down",
          my: "auto",
        }}
        onClick={handleImgClick}
      />
      <Box
        sx={{
          width: `calc(100% - ${isMB ? 80 : 100}px)`,
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: { xs: "60%", md: "65%" },
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ py: 2 }}>
            {[
              prod.codeSup || prod.code,
              prod.nome,
              prod.nomeTR,
              type === 1 && `卖价 ${getPrice(prod.price_sale)}`,
            ].map((item, index) => (
              <Typography
                key={index}
                noWrap
                textOverflow="ellipsis"
                title={item || " "}
                sx={{
                  cursor: "pointer",
                  ...(exactMatched && {
                    fontWeight: 700,
                    color: "primary.main",
                  }),
                }}
                onClick={handleShowInfo}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            p: 1,
            width: { xs: "40%", md: "35%" },
            // minWidth: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              bgcolor: "custom.gray",
              borderRadius: "10px",
              p: 0.5,
              // mx: -0.5,
              mb: 1,
            }}
          >
            {showInput ? (
              <PriceInput
                price={price}
                handleChange={(price) => {
                  console.log(111, price);
                  handleItemPut(prod._id, null, null, price)();
                  setShowInput(false);
                }}
              />
            ) : (
              <Box onClick={() => quantity > 0 && setShowInput(true)}>
                <Typography fontWeight={700} color={priceColor}>
                  {priceText} {prodPrice}
                </Typography>
              </Box>
            )}
          </Box>
          {!disableControl && (
            <ProdControl
              isMB={isMB}
              busType={busType}
              prod={prod}
              quantity={quantity}
              isSimple={prod.is_simple}
              Skus={prod.Skus}
              handleItemPost={handleItemPost}
              handleItemPut={handleItemPut}
              handleItemDelete={handleItemDelete}
              handleClickMulti={handleClickMulti}
            />
          )}
        </Box>
      </Box>
    </Card>
  );
}

const PriceInput = ({ price, handleChange }) => {
  const [priceTemp, setPriceTemp] = useState(price);
  const handleChangeSelf = (e) => {
    setPriceTemp(e.target.value);
  };
  return (
    <TextField
      autoFocus
      onFocus={(e) => e.target.select()}
      size="small"
      value={priceTemp}
      onBlur={() => handleChange(priceTemp)}
      onChange={handleChangeSelf}
      inputProps={{ autoComplete: "off", type: "number" }}
    />
  );
};
