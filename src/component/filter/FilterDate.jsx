import React, { useEffect, useState } from "react";
import moment from "moment";
//mui
import { Box, Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
// import AdapterMoment from "@mui/lab/AdapterMoment";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DatePicker from "@mui/lab/DatePicker";

import DateRangePicker from "@mui/lab/DateRangePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export default function FilterDate({ type, ...rest }) {
  const filters = {
    period: DatePeriod,
    range: DateRange,
    exact: DateExact,
  };
  // console.log(rest);
  const Filter = filters[type];

  return <Filter {...rest} />;
}

const DatePeriod = ({ label, period, handleChange }) => {
  const handleSelPeriod = (period) => () => {
    console.log(period);
    if (period > 0) {
      let curTime = new Date().getTime();
      let startDate = curTime - (period - 1) * 3600 * 24 * 1000;
      startDate = moment(startDate).format("MM/DD/YYYY");
      handleChange(startDate);
    }
  };

  return (
    <Typography variant="h5" onClick={handleSelPeriod(period)}>
      {label}
    </Typography>
  );
};

const DateRangeOld = ({
  value,
  handleChange,
  disabled,
  onClose = () => {},
}) => {
  const [range, setRange] = useState(value ?? [null, null]);
  useEffect(() => {
    if (
      range[0] &&
      range[1] &&
      moment(range[0])._isValid &&
      moment(range[1])._isValid
    ) {
      handleChange && handleChange(range);
    }
  }, [range]);
  // console.log(111, value);
  const inputSX = !disabled
    ? {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "saleLight.main",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "saleMid.main",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "custom.selected",
        },
      }
    : {};
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateRangePicker
        inputFormat="DD/MM/YYYY"
        startText="Check-in"
        endText="Check-out"
        disabled={disabled}
        closeOnSelect
        onClose={onClose}
        value={range}
        onChange={(newValue) => {
          // handleChange(newValue);
          setRange(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <Typography sx={{ mr: 1 }}>从</Typography>
            <TextField
              {...startProps}
              label=""
              size="small"
              autoComplete="off"
              inputProps={{
                ...startProps.inputProps,
                placeholder: "",
                style: { paddingLeft: 5, paddingRight: 5 },
              }}
              InputProps={{
                notched: false,
                sx: inputSX,
              }}
              sx={{ height: 42, width: 100 }}
            />
            {/* <Box sx={{ mx: 2 }}> to </Box> */}
            <Typography sx={{ mx: 1 }}>至</Typography>
            <TextField
              {...endProps}
              label=""
              size="small"
              autoComplete="off"
              inputProps={{
                ...endProps.inputProps,
                placeholder: "",
                style: { paddingLeft: 5, paddingRight: 5 },
              }}
              InputProps={{
                notched: false,
                sx: inputSX,
              }}
              sx={{
                height: 42,
                width: 100,
              }}
            />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
};

const DateRange = ({ value, handleChange, disabled, onClose = () => {} }) => {
  const [range, setRange] = useState({ start: null, end: null });
  const handleChangeSelf = (field) => (value) => {
    setRange((prev) => ({ ...prev, [field]: value }));
  };
  console.log(range);
  useEffect(() => {
    if (moment(range?.start)._isValid && moment(range?.end)._isValid) {
      handleChange && handleChange([range.start, range.end]);
    }
  }, [range]);
  const inputSX = !disabled
    ? {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "saleLight.main",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "saleMid.main",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "custom.selected",
        },
      }
    : {};
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ mr: 1, fontSize: 18 }}>从</Typography>
        <DatePicker
          inputFormat="DD/MM/YYYY"
          disabled={disabled}
          value={range.start}
          onChange={handleChangeSelf("start")}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              autoComplete="off"
              inputProps={{
                ...params.inputProps,
                // placeholder: "",
                style: { paddingLeft: 5, paddingRight: 0 },
              }}
              InputProps={{
                ...params.InputProps,
                notched: false,
                sx: inputSX,
              }}
              sx={{
                width: 230,
                "& .MuiInputAdornment-root": {
                  marginLeft: 0,
                },
              }}
            />
          )}
        />
        <Typography sx={{ mx: 1, fontSize: 18 }}>至</Typography>
        <DatePicker
          inputFormat="DD/MM/YYYY"
          disabled={disabled}
          value={range.end}
          onChange={handleChangeSelf("end")}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              autoComplete="off"
              inputProps={{
                ...params.inputProps,
                // placeholder: "",
                style: { paddingLeft: 5, paddingRight: 0 },
              }}
              InputProps={{
                ...params.InputProps,
                notched: false,
                sx: inputSX,
                // width: 150,
              }}
              sx={{
                // width: 250,
                "& .MuiInputAdornment-root": {
                  marginLeft: 0,
                },
              }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

const DateExact = ({ label = "", value, handleChange }) => (
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <DatePicker
      inputFormat="DD/MM/YYYY"
      label={label}
      value={value || new Date()}
      onChange={(newValue) => {
        handleChange(newValue);
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  </LocalizationProvider>
);
