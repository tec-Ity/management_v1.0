import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CusButtonGroup from "../buttonGroup/CusButtonGroup.jsx";
import PercentIcon from "@mui/icons-material/Percent";
import RemoveIcon from "@mui/icons-material/Remove";
const DEFAULT_DISCOUNTS = [0, 0.1, 0.2, 0.5, -1];

export default function DiscountComp({
  discounts = DEFAULT_DISCOUNTS,
  defaultPrice,
  value,
  onChange,
  disabled = false,
  percentMode = false,
}) {
  //init custom percent
  const [customPer, setCustomPer] = useState(
    defaultPrice
      ? 1 - value / defaultPrice < 0
        ? parseFloat(0).toFixed(2)
        : ((1 - value / defaultPrice) * 100)?.toFixed(2)
      : parseFloat(0).toFixed(2)
  );
  //update cp when parent value changed
  //also toggle enable custom
  useEffect(() => {
    const newCP = defaultPrice
      ? 1 - value / defaultPrice < 0
        ? parseFloat(0).toFixed(2)
        : ((1 - value / defaultPrice) * 100)?.toFixed(2)
      : parseFloat(0).toFixed(2);
    setCustomPer(newCP);
    Boolean(DEFAULT_DISCOUNTS?.indexOf(newCP / 100) === -1) &&
      setEnableCustomPer(true);
  }, [value]);

  const initBtnValue = discounts?.find((per) => {
    return (
      ((1 - per) * defaultPrice)?.toFixed(2) === parseFloat(value)?.toFixed(2)
    );
  });

  const [enableCustomPer, setEnableCustomPer] = useState(
    Boolean(DEFAULT_DISCOUNTS?.indexOf(initBtnValue) === -1)
  );

  const handleSelfChange = (percentOff, custom) => {
    console.log(percentOff, custom);
    if (percentOff < 0) {
      setEnableCustomPer(true);
      return;
    }
    if (!custom) {
      console.log(11);
      setEnableCustomPer(false);
      setCustomPer((percentOff * 100)?.toFixed(2));
    }
    if (defaultPrice) {
      let valueTemp = defaultPrice * (1 - percentOff);
      onChange(valueTemp);
    } else if (percentMode) onChange(percentOff);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        mt: 3,
      }}
    >
      <Typography fontWeight={700} sx={{ mb: { xs: 1, md: 0 } }}>
        折扣：
      </Typography>
      <CusButtonGroup
        disabled={disabled}
        initValue={
          //only auto calculate when default price was set
          defaultPrice
            ? !isNaN(parseFloat(initBtnValue))
              ? initBtnValue
              : -1
            : null
        }
        busType="sale"
        buttonObjs={discounts?.map((per) =>
          per >= 0
            ? {
                label: `-${per * 100}%`,
                value: per,
                width: 60,
              }
            : { label: "自定义", value: per, width: 80 }
        )}
        handleChange={handleSelfChange}
      />
      <TextField
        disabled={disabled || !enableCustomPer}
        value={customPer}
        onChange={(e) => setCustomPer(e.target.value)}
        onBlur={() => handleSelfChange(parseFloat(customPer) / 100, true)}
        onKeyDown={(e) =>
          (e.code === "Enter" || e.code === "NumpadEnter") && e.target.blur()
        }
        sx={{ ml: 2, width: 150, mt: { xs: 1, md: 0 } }}
        inputProps={{ style: { textAlign: "center" } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* <Typography sx={{ fontSize: 28 }}>-</Typography> */}
              <RemoveIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {/* <Typography sx={{ fontSize: 20 }}>%</Typography> */}
              <PercentIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
