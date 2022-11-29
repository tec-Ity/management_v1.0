import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
//mui
import { Box, IconButton, Typography } from "@mui/material";

export default function ProdControl({
  isMB,
  busType = "sale",
  size = "large",
  prod,
  Skus,
  sku,
  isSimple,
  quantity,
  handleItemPost = () => {},
  handleItemPut = () => {},
  handleItemDelete = () => {},
  handleClickMulti = () => {},
}) {
  const prodId = prod?._id;
  const skuId = sku?._id;
  const [showInput, setShowInput] = useState(false);
  const [tempQty, setTempQty] = useState("");
  // console.log(quantity);
  // console.log(tempQty);
  const edge = {
    medium: 40,
    large: 48,
  }[size];
  return (
    <Box
      sx={{
        backgroundColor: `${(busType = "sale")}Light.main`,
        borderRadius: "5px",
        color: "custom.primary",
        transition: "width 0.2s",
        display: "flex",
        justifyContent: quantity === 0 && !isMB ? "center" : "space-between",
        alignItems: "center",
        "&:hover": {
          backgroundColor: `${busType}Mid.main`,
          boxShadow: "0px 0px 20.5701px rgba(0, 0, 0, 0.1)",
          color: "custom.white",
        },
        width: quantity > 0 || isMB ? "100%" : edge,
        height: edge,
      }}
    >
      {isSimple ? (
        <>
          {quantity > 0 || isMB ? (
            <>
              {quantity === 1 && !isMB ? (
                <IconButton
                  onClick={handleItemDelete(prodId, skuId)}
                  sx={{ pr: showInput && 0 }}
                >
                  <DeleteIcon sx={{ color: "#fff" }} />
                </IconButton>
              ) : (
                <IconButton
                  disabled={quantity === 0 && isMB}
                  onClick={
                    quantity === 1
                      ? handleItemDelete(prodId, skuId)
                      : handleItemPut(prodId, skuId, quantity - 1)
                  }
                  sx={{ pr: showInput && 0 }}
                >
                  <RemoveIcon sx={{ color: "#fff" }} />
                </IconButton>
              )}
              {showInput ? (
                <input
                  type={isMB ? "number" : "text"}
                  pattern="[0-9]"
                  autoFocus
                  value={tempQty ?? quantity}
                  onChange={(e) => setTempQty(e.target.value)}
                  onBlur={() => {
                    if (tempQty && !isNaN(tempQty)) {
                      //active only has input number
                      quantity > 0 //put or post?
                        ? tempQty > 0 //put or delete?
                          ? handleItemPut(prodId, skuId, parseInt(tempQty))()
                          : handleItemDelete(prodId, skuId)()
                        : handleItemPost(prod, sku, parseInt(tempQty))();
                      setTempQty("");
                    }
                    setShowInput(false);
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    fontSize: 16,
                    textAlign: "center",
                    backgroundColor: "#00000000",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",
                  }}
                />
              ) : (
                <Typography
                  sx={{ fontSize: 16, fontWeight: 700 }}
                  color="#fff"
                  onClick={() => setShowInput(true)}
                >
                  {quantity}
                </Typography>
              )}
              <IconButton
                onClick={
                  quantity > 0
                    ? handleItemPut(prodId, skuId, quantity + 1)
                    : handleItemPost(prod, sku)
                }
                sx={{ pl: showInput && 0 }}
              >
                <AddIcon sx={{ color: "#fff" }} />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleItemPost(prod, sku)}>
              <AddIcon sx={{ color: "#fff" }} />
            </IconButton>
          )}
        </>
      ) : (
        // multi sku button
        <IconButton
          sx={{ width: "100%", color: "white" }}
          onClick={handleClickMulti(prod, Skus)}
        >
          <ListIcon />
          {quantity > 0 && (
            <Typography sx={{ ml: 1 }} fontWeight={700}>
              ( {quantity} )
            </Typography>
          )}
        </IconButton>
      )}
    </Box>
  );
}

// const QuantityInput = ({quantity, handleItemPut})=>{

//   const [showInput, setShowInput] = React.useState(false)

//   return
// }
