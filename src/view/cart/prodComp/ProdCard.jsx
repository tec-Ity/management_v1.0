import React, { useState } from "react";
import { useSelector } from "react-redux";
//mui
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

import { selectProdQuantity } from "../reducer/cartSlice";
import ProdControl from "./ProdControl";
import getPrice from "../../../utils/price/getPrice";

export default function ProdCard({
  prod,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
  handleClickMulti,
}) {
  const [elevation, setElevation] = useState(0);
  const quantity = useSelector(selectProdQuantity(prod._id));
  const DNS = useSelector((state) => state.auth.DNS);

  // console.log(quantity);

  return (
    <Card
      elevation={elevation}
      sx={{
        width: 150,
        height: 204,
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={() => setElevation(10)}
      onMouseLeave={() => setElevation(0)}
      onClick={
        prod?.is_simple
          ? quantity === 0
            ? handleItemPost(prod)
            : () => {}
          : handleClickMulti(prod)
      }
    >
      <CardMedia
        component="img"
        src={prod?.img_xs ? DNS + prod.img_xs : undefined}
        alt={prod.nome}
        sx={{
          height: 113,
          width: 150,
          backgroundColor: "custom.white",
          objectFit: "scale-down",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 70,
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ProdControl
          prod={prod}
          quantity={quantity}
          isSimple={prod.is_simple}
          Skus={prod.Skus}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
          handleClickMulti={handleClickMulti}
        />
      </Box>
      <CardContent sx={{ p: 1 }}>
        <Typography fontWeight={700} textOverflow="ellipsis">
          {prod.price_min === prod.price_max
            ? getPrice(prod.price_sale)
            : `${getPrice(prod.price_min)}-${getPrice(prod.price_max)}`}{" "}
          / {prod.unit ?? "件"}
        </Typography>
        <Typography textOverflow="ellipsis" noWrap title={prod.nome}>
          {prod.nome}
        </Typography>
        <Typography textOverflow="ellipsis" noWrap title={prod.nomeTR}>
          {prod.nomeTR}
        </Typography>
      </CardContent>
    </Card>
  );
}
