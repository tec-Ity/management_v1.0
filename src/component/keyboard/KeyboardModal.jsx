import React, { useState } from "react";
import CusDialog from "../modal/CusDialog";
import { NumberKeyboard } from "react-vant";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import DiscountComp from "../discount/DiscountComp";
import { t } from "i18next";
export default function KeyboardModal({
  open,
  onClose,
  title,
  value: pValue,
  onChange,
  onBlur,
  onFinish,
  keyboard = true,
  // price = false,
  startAdornment,
  discountProps = { enableDiscount: false, discounts: null, defaultPrice: 0 },
}) {
  const { enableDiscount, discounts, defaultPrice } = discountProps || {};

  const [initSelected, setInitSelected] = useState(true);
  const [value, setValue] = useState(pValue ? String(pValue) : "");
  console.log(value, pValue);

  React.useEffect(() => {
    console.log(initSelected, pValue, value, pValue !== value);
    initSelected && pValue !== value && setValue(pValue);
  }, [pValue]);

  const handleDiscountChange = (value) => {
    setValue(value?.toFixed(2));
  };
  return (
    <CusDialog
      open={Boolean(open)}
      dividers
      title={title}
      size="sm"
      content={
        <Box sx={{ minHeight: { xs: 200, md: enableDiscount ? 450 : 360 } }}>
          <TextField
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onFocus={(e) => {
              e.target.select();
              setInitSelected(true);
            }}
            sx={{ width: "100%" }}
            // {...rest}
            InputProps={{
              startAdornment: startAdornment ? (
                <InputAdornment>
                  <Typography sx={{ mr: 1 }}>{startAdornment}</Typography>
                </InputAdornment>
              ) : (
                <></>
              ),
            }}
          />
          {enableDiscount && (
            <DiscountComp
              discounts={discounts}
              defaultPrice={defaultPrice}
              value={value}
              onChange={handleDiscountChange}
            />
          )}
          <Box sx={{ display: { xs: "none", md: "inherit" } }}>
            <NumberKeyboard
              visible
              // value={value}
              onChange={(v) => {
                console.log("onChange", v, initSelected);
                if (!initSelected) setValue((prev) => prev + v);
              }}
              onInput={(v) => {
                console.log("onInput", v);
                if (initSelected) {
                  setValue(String(v));
                  setInitSelected(false);
                }
              }}
              onClose={() => {
                if (value) {
                  console.log("onClose");
                  onChange && onChange(value);
                  onClose();
                  onFinish && onFinish(value); //compatible with non keyboard input's subsequent procedure
                  onBlur && onBlur();
                }
              }}
              theme="custom"
              extraKey={[".", ","]}
              closeButtonText="完成"
              style={{
                position: "absolute",
              }}
            />
          </Box>
          <Box sx={{ display: { xs: "inherit", md: "none" }, mt: 2 }}>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={() => {
                onChange(value);
                onClose();
              }}
            >
              {t("general.confirm")}
            </Button>
          </Box>
        </Box>
      }
    />
  );
}
