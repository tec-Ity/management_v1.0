import React, { useState, useEffect, useCallback } from "react";
//mui
import TextField from "@mui/material/TextField";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DiscountComp from "../discount/DiscountComp";
export default function FormInput({
  type = "text",
  rules,
  formWarning = "",
  ...rest
}) {
  //component sel
  const inputs = {
    text: TextInput,
    pwd: PasswordInput,
    phone: PhoneInput,
    // account: AccountInput,
    price: PriceInput,
    select: SelectInput,
  };
  const Input = inputs[type];

  const [warningMsg, setWarningMsg] = useState("");

  const fieldCheck = useCallback(
    (value) => (e) => {
      let msgSet = false;
      if (rules && rules.length > 0)
        for (const key in rules) {
          if (Object.hasOwnProperty.call(rules, key)) {
            const rule = rules[key];
            switch (key) {
              case "required":
                if (rule === true && !value) {
                  setWarningMsg("Required!");
                  msgSet = true;
                }
                break;
              case "length":
                if (rule.min && rule.max) {
                  if (!(value.length >= rule.min && value.length <= rule.max)) {
                    setWarningMsg(
                      `Length must be ${rule.min} to ${rule.max} long!`
                    );
                    msgSet = true;
                  }
                } else if (rule.min) {
                  //////
                }
                break;
              case "type":
                ///
                break;
              default:
                break;
            }
            if (msgSet) break; //break for loop for rules after matching on rule
          }
        }
      //clear warning after next submit
      if (!msgSet) setWarningMsg(null);
    },
    [rules]
  );

  return (
    <Input
      {...rest}
      required={rules?.required}
      fieldCheck={fieldCheck}
      warningMsg={formWarning || warningMsg}
    />
  );
}

const TextInput = ({
  label,
  value,
  required,
  disabled,
  handleChange,
  warningMsg,
  fieldCheck,
  placeholder,
  startAdornment,
  endAdornment,
  sx,
  ...rest
}) => {
  // console.log(value);
  return (
    <TextField
      sx={{ width: "100%", ...sx }}
      size="medium"
      variant="standard"
      required={required}
      disabled={disabled}
      label={label}
      value={value}
      error={Boolean(warningMsg)}
      helperText={warningMsg}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={fieldCheck(value)}
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
        endAdornment: endAdornment && (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ),
      }}
      // {...rest}
    />
  );
};

function PasswordInput({
  label,
  value,
  required,
  handleChange,
  warningMsg,
  placeholder,
  fieldCheck,
  sx,
  ...rest
}) {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <TextField
      sx={{ width: "100%", ...sx }}
      size="medium"
      variant="standard"
      required={required}
      label={label}
      value={value}
      error={Boolean(warningMsg)}
      helperText={warningMsg}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={fieldCheck(value)}
      type={showPwd ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPwd((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPwd ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
}

function PhoneInput({
  label,
  value,
  required,
  handleChange,
  warningMsg,
  placeholder,
  fieldCheck,
  sx,
  ...rest
}) {
  const [phonePre, setPhonePre] = useState(39);

  const phoneNum = value.phoneNum ?? value;

  return (
    <TextField
      sx={{ width: "100%", ...sx }}
      size="medium"
      variant="standard"
      required={required}
      label={label}
      value={phoneNum}
      error={Boolean(warningMsg)}
      helperText={warningMsg}
      placeholder={placeholder}
      onChange={(e) => handleChange({ phonePre, phoneNum: e.target.value })}
      onBlur={fieldCheck(value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FormControl variant="standard">
              <Select
                labelId="country-select-label"
                id="country-select"
                value={phonePre}
                onChange={(e) => setPhonePre(e.target.value)}
              >
                <MenuItem value="" key={"placeholder"}>
                  --请选择区号--
                </MenuItem>
                <MenuItem value={39} key={39}>
                  +39
                </MenuItem>
                <MenuItem value={86} key={86}>
                  +86
                </MenuItem>
              </Select>
            </FormControl>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
}

function PriceInput({
  label,
  value,
  required,
  handleChange,
  warningMsg,
  fieldCheck,
  placeholder,
  sx,
  hasDiscount,
  discountDefaultPrice,
  disabled,
  ...rest
}) {
  const [selfWarning, setSelfWarning] = useState(null);

  const onChange = useCallback((value) => {
    if (typeof value === "string" && isNaN(value?.replace(/[,.]/, ""))) {
      setSelfWarning("Must be a number or ',' or '.'!");
    } else {
      setSelfWarning(null);
      handleChange(value);
    }
  }, []);

  const convertValue = useCallback((value) => {
    if (typeof value === "number") {
      return parseFloat(value)?.toFixed(2)?.replace(".", ",");
    } else if (value) return value;
    else return "";
  }, []);
  // useEffect(() => {});
  return (
    <Grid
      container
      item
      xs={12}
      sx={{ width: "100%", display: "flex", alignItems: "center", ...sx }}
    >
      <Grid item xs={12} md={hasDiscount ? 4 : 12}>
        <TextField
          sx={{ width: "100%", ...sx }}
          size="medium"
          variant="standard"
          required={required}
          label={label}
          value={convertValue(value)}
          error={Boolean(selfWarning || warningMsg)}
          helperText={selfWarning || warningMsg}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={fieldCheck(value)}
          disabled={disabled}
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          {...rest}
        />
      </Grid>
      {hasDiscount && value && discountDefaultPrice && (
        <>
          <Grid item xs={1} sx={{ display: { xs: "none", md: "inherit" } }} />
          <Grid item xs={12} md={7}>
            <DiscountComp
              disabled={disabled}
              defaultPrice={discountDefaultPrice}
              value={value}
              onChange={onChange}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

function SelectInput({
  label,
  value,
  required,
  disabled,
  handleChange,
  warningMsg,
  fieldCheck,
  placeholder,
  options,
  getOptions,
  sx,
  ...rest
}) {
  const optionList = options ? options : getOptions();
  return (
    <TextField
      select
      sx={{ width: "100%", ...sx }}
      size="medium"
      variant="standard"
      required={required}
      disabled={disabled}
      label={label}
      value={value}
      error={Boolean(warningMsg)}
      helperText={warningMsg}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={fieldCheck(value)}
      {...rest}
    >
      {optionList?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export { TextInput };
