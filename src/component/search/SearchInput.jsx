import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import Input from "../input/Input";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import { useSelector } from "react-redux";
export default function SearchInput({
  handleChange, //(value,select)
  realTime = true, //if false, only ENTER can trigger handleChange
  clearOnSelect = true,
  placeholder,
  style = {
    borderColor: null,
    borderColorHover: null,
    borderColorFocused: null,
  },
  focus,
  onFocus,
  numOnly,
  handleKeyDown = () => {},
  busType,
  autoFocus,
  debounceTimeout = 0.3, //seconds
  allowKeyboard = false,
}) {
  const { t } = useTranslation();
  const isMB = useMediaQuery(useTheme().breakpoints.down("md"));
  const touchMode = useSelector((state) => state.root.settings.touchMode);
  const ref = useRef(null);
  const [value, setValue] = useState("");
  const [timeoutStarted, setTimeoutStarted] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [selected, setSelected] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ControlRight") ref.current.focus();
    });
  }, []);

  useEffect(() => {
    if (focus === true) {
      ref.current.focus();
      onFocus && onFocus();
      setValue("");
    }
  }, [focus]);

  useEffect(() => {
    if (realTime) {
      if (value && allowAction === false && timeoutStarted === false) {
        setTimeoutStarted(true);
        setTimeout(() => {
          setAllowAction(true);
        }, debounceTimeout * 1000);
      }
    } else {
      if (!value) handleChange("");
    }
    if (!value && selected === false) handleChange();
  }, [value]);

  useEffect(() => {
    if (selected === true) {
      setSelected(false);
    } else if (selected === false && allowAction === true) {
      handleChange(value);
    }
    setAllowAction(false);
    setTimeoutStarted(false);
  }, [allowAction]);

  return (
    <Box sx={{ zIndex: 99, width: "100%", display: "flex" }}>
      <Input
        touch={showKeyboard}
        initShowKeyboard={showKeyboard}
        label={t("general.search")}
        size={isMB ? "small" : "medium"}
        // sx={{ zIndex: 99, width: "100%" }}
        placeholder={placeholder || t("general.search")}
        variant="outlined"
        autoFocus={false}
        fullWidth
        onFocus={(e) => e.target.select()}
        // onBlur={onSearchBlur}
        value={value}
        inputRef={ref}
        onChange={(value) => {
          // console.log(event, value);
          // if (/^[A-Za-z0-9]+$/.test(value) || !value)
          if (
            value.indexOf("+") === -1 &&
            value.indexOf("]") === -1 &&
            value.indexOf("-") === -1 &&
            value.indexOf("】") === -1
          )
            setValue(value);
        }}
        onFinish={() => setShowKeyboard(false)}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter") {
            // console.log(1111);
            handleChange(value, true);
            setSelected(true);
            clearOnSelect && setValue("");
          }
          handleKeyDown(e, value, () => clearOnSelect && setValue(""));
        }}
        // sx={{ my: 2 }}
        InputLabelProps={{
          sx: {
            color: "custom.primary",
            "&.Mui-focused": { color: "custom.primary" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{ display: { xs: "none", md: "inherit" } }}
            >
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="start" sx={{ cursor: "pointer" }}>
              <ClearIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("");
                  handleChange("");
                }}
              />
            </InputAdornment>
          ),
          sx: {
            maxHeight: 50,
            borderRadius: "25px",
            backgroundColor: "custom.white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: style.borderColor
                ? style.borderColor
                : "custom.white",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: style.borderColorHover
                ? style.borderColorHover
                : "primary.main",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: style.borderColorFocused
                ? style.borderColorFocused
                : "primary.main",
            },
          },
        }}
        // inputProps={{ autoComplete: "off", type: "text" }}
        inputProps={{ autoComplete: "off", type: numOnly ? "number" : "text" }}
      />
      {allowKeyboard && !isMB && touchMode && (
        <Button
          variant="contained"
          color="saleLight"
          onClick={() => setShowKeyboard(true)}
          sx={{ ml: 2, borderRadius: "10px" }}
        >
          <KeyboardAltIcon />
        </Button>
      )}
    </Box>
  );
}

// backgroundColor: "custom.white",
// "& .MuiOutlinedInput-notchedOutline": {
//   borderColor: "custom.white",
// },
// "&:hover .MuiOutlinedInput-notchedOutline": {
//   borderColor: "custom.primary",
// },
// "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//   borderColor: "custom.selected",
// },
