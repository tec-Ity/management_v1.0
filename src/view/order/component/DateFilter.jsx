import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
//mui
import { Box, Typography, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker from "@mui/lab/DateRangePicker";
import CusFilterDialog from "../../../component/filter/CusFilterDialog";
import { setQuery } from "../../../redux/fetchSlice";
import { useTranslation } from "react-i18next";
import FilterDate from "../../../component/filter/FilterDate";

export default function DateFilter({
  fetchObjs,
  onParentModalClosed = () => {}, //used for extra content
  ...rest
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [range, setRange] = useState([null, null]);
  const [rangeFocused, setRangeFocused] = useState(false);

  useEffect(() => {
    return () => {
      // console.log(11111111111111);
      dispatch(
        setQuery({
          fetchObjs,
          query: { crt_after: null, crt_before: null },
          isRemove: true,
        })
      );
    };
  }, []);
  const setRangeQuery = (value) => {
    console.log(value);
    if (
      value[0] &&
      value[1] &&
      moment(value[0])._isValid &&
      moment(value[1])._isValid
    ) {
      dispatch(
        setQuery({
          fetchObjs,
          query: {
            crt_after: moment(value[0]).format("MM/DD/YYYY"),
            crt_before: moment(value[1]).format("MM/DD/YYYY"),
          },
        })
      );
      setRange(value);
    }
  };
  const handleSelPeriod = (period) => () => {
    // console.log(period);
    if (isNaN(parseInt(period))) return;
    let startDate = null;
    if (period > 0) {
      let curTime = new Date().getTime();
      startDate = curTime - (period - 1) * 3600 * 24 * 1000;
      startDate = moment(startDate).format("MM/DD/YYYY");
    }
    dispatch(
      setQuery({
        fetchObjs,
        query: { crt_after: startDate, crt_before: null },
      })
    );
    setRangeFocused(false);
    onParentModalClosed();
  };

  const items = React.useMemo(
    () => [
      { content: "不限", handleClick: handleSelPeriod(0) },
      { content: t("date.today"), handleClick: handleSelPeriod(1) },
      // { content: t("date.last3"), handleClick: handleSelPeriod(3) },
      { content: t("date.last7"), handleClick: handleSelPeriod(7) },
      { content: t("date.last30"), handleClick: handleSelPeriod(30) },
      { content: t("date.last90"), handleClick: handleSelPeriod(90) },
      {
        btnLabel:
          range[0] && range[1]
            ? `${moment(range[0]).format("MM/DD/YYYY")}--${moment(
                range[1]
              ).format("MM/DD/YYYY")}`
            : "未选择",
        getExtraContent: ({ onClose }) => (
          <Box
            sx={{
              py: 1,
              px: { xs: 1, md: 2 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onClick={() => setRangeQuery()}
          >
            <FilterDate
              value={range}
              type="range"
              handleChange={setRangeQuery}
              onClose={onClose}
            />
          </Box>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rangeFocused, range]
  );

  return (
    <CusFilterDialog label={"日期"} items={items} defaultSel={0} {...rest} />
  );
}
