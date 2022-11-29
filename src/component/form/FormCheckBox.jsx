import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import React from "react";

export default function FormCheckBox({
  label,
  value,
  required,
  disabled,
  handleChange,
  warningMsg,
  sx,
  size = "medium",
}) {
  return (
    <>
      <FormControlLabel
        sx={{ "& .MuiFormControlLabel-label": { minWidth: 80 } }}
        control={
          <Checkbox
            disabled={disabled}
            sx={sx}
            size={size}
            checked={Boolean(value)}
            onChange={(e) => handleChange(e.target.checked)}
          />
        }
        label={label}
      />
      {/* <FormHelperText>You can display an error</FormHelperText> */}
    </>
  );
}
