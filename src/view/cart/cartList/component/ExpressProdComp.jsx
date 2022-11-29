import React, { useState } from "react";
import CusH6 from "../../../../component/typography/CusH6";
import KeyboardModal from "../../../../component/keyboard/KeyboardModal.jsx";
import {
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import getPrice from "../../../../utils/price/getPrice";
import { selectProdQuantity } from "../../reducer/cartSlice";
import { t } from "i18next";
export default function ExpressProdComp({ handleItemPut, handleItemPost }) {
  const DNS = useSelector((state) => state.auth.DNS);
  const expressProds = useSelector((state) => state.prodStorage.expressProds);
  const [curExpressProd, setCurExpressProd] = useState(null);
  const curQuantity = useSelector(selectProdQuantity(curExpressProd?._id));

  const handleKeyboardChange = (value) => {
    console.log(curExpressProd, value, curQuantity);
    if (!curExpressProd) return;
    if (curQuantity > 0)
      handleItemPut(curExpressProd?._id, null, null, value)();
    else handleItemPost(curExpressProd, null, 1, value)();
  };
  return expressProds?.length > 0 ? (
    <>
      <Paper
        elevation={0}
        sx={{
          boxSizing: "border-box",
          bgcolor: "custom.whiteLight",
          borderRadius: "10px",
          p: 1,
          mt: 1,
          mb: 2,
          height: 90,
        }}
      >
        <Grid
          container
          item
          xs={12}
          columnSpacing={1}
          alignItems="center"
          sx={{ height: "100%" }}
        >
          {expressProds?.map((exProd) => {
            const { _id, img_xs, nome, price_regular } = exProd;
            return (
              <Grid item xs={12 / expressProds.length} key={_id}>
                <Card onClick={() => setCurExpressProd(exProd)}>
                  <CardActionArea>
                    <Box sx={{ display: "flex", height: "100%" }}>
                      {img_xs && (
                        <CardMedia
                          component="img"
                          image={DNS + img_xs}
                          alt={nome}
                          sx={{
                            height: 60,
                            width: 60,
                            objectFit: "scale-down",
                          }}
                        />
                      )}
                      <Box sx={{ p: 1 }}>
                        <CusH6 type="sale" sx={{ fontSize: 16 }}>
                          {nome}
                        </CusH6>
                        <Typography noWrap textOverflow="ellipsis">
                          {getPrice(price_regular)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      <KeyboardModal
        key={curExpressProd?._id}
        value={curExpressProd?.price_regular}
        title={t("cart.price")}
        open={Boolean(curExpressProd)}
        onClose={() => setCurExpressProd(null)}
        onChange={handleKeyboardChange}
      />
    </>
  ) : (
    <></>
  );
}
