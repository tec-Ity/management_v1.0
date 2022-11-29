import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
export default function CusButtonGroup({
  busType = "sale",
  buttonObjs /*[{label, value, width}] */,
  handleChange,
  size = "medium",
  orientation = "horizontal",
  sx,
  initValue,
  disabled = false,
}) {
  const [alignment, setAlignment] = React.useState(
    initValue || buttonObjs[0].value
  );
  React.useEffect(() => initValue && setAlignment(initValue), [initValue]);
  const handleChangeSelf = (e, alignment) => {
    if (alignment !== null) {
      setAlignment(alignment);
      handleChange(alignment);
    }
  };
  // console.log(buttonObjs);
  return (
    <ToggleButtonGroup
      disabled={disabled}
      // color={busType}
      size={size || "medium"}
      orientation={orientation}
      value={alignment}
      exclusive
      onChange={handleChangeSelf}
      sx={sx}
    >
      {buttonObjs.map((btn) => (
        <ToggleButton
          key={btn.value}
          value={btn.value}
          sx={{
            // minWidth: 60,
            minWidth: btn.width ? btn.width : size === "small" ? 60 : 100,
            transition: "opacity 0.2s",
            "&.Mui-selected": {
              bgcolor: `${busType}Mid.main`,
              color: "custom.white",
              // opacity: 0.9,
              "&:hover": {
                bgcolor: `${busType}Mid.main`,
                color: "custom.white",
                opacity: 0.7,
              },
            },
            "&:hover": {
              bgcolor: `${busType}Mid.main`,
              color: "custom.white",
              opacity: 0.5,
            },
            ...sx,
          }}
        >
          {btn.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
