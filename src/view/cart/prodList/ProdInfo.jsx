import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import prodFormInputs from "../../../config/module/prod/prodFormInputs";
import { useTranslation } from "react-i18next";
import getPrice from "../../../utils/price/getPrice";

export default function ProdInfo({ prod }) {
  const { t } = useTranslation();
  const getInfo = (
    prod,
    field,
    type,
    itemType,
    optionLabel,
    optionValue,
    multiple
  ) => {
    console.log(
      prod,
      field,
      type,
      itemType,
      optionLabel,
      optionValue,
      multiple
    );
    if (type === "price") return getPrice(prod[field]);
    if (itemType === "autoComplete") {
      if (multiple)
        return prod[field]?.map((obj) => obj[optionLabel])?.join(", ");
      else {
        if (optionLabel !== optionValue)
          return prod[field] ? prod[field][optionLabel] : "";
      }
    }
    return prod[field];
  };
  return (
    <Grid container>
      <Grid container item xs={12}>
        {/* <Box
        component="img"
        src={prod?.img_urls.length > 0 ? DNS + prod.img_urls[0] : prodImage}
        alt=""
        sx={{
          p: 1,
          boxSizing: "border-box",
          height: view === "MB" ? 80 : 100,
          width: view === "MB" ? 80 : 100,
          backgroundColor: "custom.white",
          objectFit: "scale-down",
          my: "auto",
        }}
        onClick={handleImgClick}
      /> */}
      </Grid>
      {prodFormInputs?.map((formInput) => {
        if (formInput.group) {
          return formInput.inputs?.map((data) => {
            const { field, label } = data.general;
            const {
              type,
              itemType,
              endAdornment,
              optionLabel,
              optionValue,
              multiple,
            } = data.itemProps;
            const { isShow } = data.formProps;
            // console.log(label);
            if (
              field !== "price_cost" &&
              (!isShow || isShow({ formType: null }))
            )
              return (
                <Grid
                  container
                  item
                  xs={12}
                  key={field}
                  sx={{ minHeight: 50, fontSize: 16 }}
                >
                  <Typography sx={{ mr: 1, fontWeight: 700 }}>
                    {t(`formField.${label}`)}:
                  </Typography>
                  <Typography>
                    {getInfo(
                      prod,
                      field,
                      type,
                      itemType,
                      optionLabel,
                      optionValue,
                      multiple
                    )}{" "}
                    {endAdornment}
                  </Typography>
                  <Grid item xs={12} sx={{ pt: 1 }}>
                    <Divider />
                  </Grid>
                </Grid>
              );
          });
        }
      })}
    </Grid>
  );
}
