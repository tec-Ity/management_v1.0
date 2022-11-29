import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalysis } from "./analysisSlice";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import CusButtonGroup from "../../component/buttonGroup/CusButtonGroup";
import FilterDate from "../../component/filter/FilterDate";
import moment from "moment";
// import analysisObjsGetters from "./analysisObjsGetters";
// import FieldSection from "./FieldSection";
import CusFilterDialog from "../../component/filter/CusFilterDialog";
import fetchAnalysisObjsGetters from "./fetchAnalysisObjsGetters";
import GeneralField from "./fieldComps/GeneralField";
import OrderProdField from "./fieldComps/OrderProdField.jsx";
import SubjectField from "./fieldComps/SubjectField.jsx";
import PaidTypeField from "./fieldComps/PaidTypeField";
import CoinField from "./fieldComps/CoinField";

const fieldComponents = {
  general: GeneralField,
  orderProd: OrderProdField,
  subject: SubjectField,
  paidType: PaidTypeField,
  coin: CoinField,
};

export default function DashBoard({
  defaultField = "general" || "orderProd" || "subject" || "paidType",
  defaultMatchObj = {},
  defaultType = -1,
  showTitle = true,
  showTypeButtons = true,
  showFieldButtons = true,
  customDateButtons,
  size = "medium",
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const analysisData = useSelector((state) => state.analysis.analysisData);
  const [field, setField] = useState(defaultField);
  const [type, setType] = useState(defaultType);
  const [allowDateRange, setAllowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState();
  const initMatchObj = {
    crt_after: moment().format("MM/DD/YYYY"),
    type_Order: -1,
    is_virtual: false,
  };
  const [matchObj, setMatchObj] = useState({
    ...initMatchObj,
    ...defaultMatchObj,
  });
  // console.log(11111, matchObj);
  const busType = type === 1 ? "purchase" : "sale";
  const FieldComponent = fieldComponents[field];

  const fetchAnalysisObjs = React.useMemo(
    () => fetchAnalysisObjsGetters[field](matchObj),
    [field, matchObj]
  );

  const typeButtons = [
    { label: "销售", value: -1 },
    { label: "采购", value: 1 },
  ];

  const dateButtons = customDateButtons || [
    { label: t("date.today"), value: 1 },
    // { label: t("date.yesterday"),value:2 },
    { label: t("date.last7"), value: 7 },
    { label: t("date.last30"), value: 30 },
    { label: t("date.last90"), value: 90 },
  ];
  if (!isMB) dateButtons.push({ label: "自选", value: 0, hide: isMB });

  const fieldButtons = [
    { label: t("dashboard.field.general"), value: "general" },
    { label: t("dashboard.field.product"), value: "orderProd" },
    type === 1
      ? { label: t("dashboard.field.supplier"), value: "subject" }
      : { label: t("dashboard.field.client"), value: "subject" },
    { label: t("dashboard.field.paidType"), value: "paidType" },
    // { label: t("dashboard.field.coin"), value: "coin" },
  ];

  const handleSwitchDate = (value) => {
    //helper for range
    const setRange = (value, setState) => {
      const startDate = moment(value[0]).format("MM/DD/YYYY");
      const endDate = moment(value[1]).format("MM/DD/YYYY");
      setMatchObj((prev) => ({
        ...prev,
        crt_after: startDate,
        crt_before: endDate,
      }));
      if (setState) setDateRange(value);
    };
    // console.log(value);
    //function body

    if (!isNaN(value) && value === -1) {
      // no limit
      setMatchObj((prev) => ({
        ...prev,
        crt_after: null,
        crt_before: null,
      }));
    } else if (!isNaN(value) && value > 0) {
      //period
      setAllowDateRange(false);
      let curTime = new Date().getTime();
      let startDate = curTime - (value - 1) * 3600 * 24 * 1000;
      startDate = moment(startDate).format("MM/DD/YYYY");
      console.log(startDate);
      // return startDate;
      setMatchObj((prev) => ({
        ...prev,
        crt_after: startDate,
        crt_before: null,
      }));
    } else if (!isNaN(value) && value === 0) {
      //self select range btn
      console.log(dateRange);
      setAllowDateRange(true);
      if (dateRange) setRange(dateRange);
    } else if (typeof value === "object") setRange(value, true); //range
  };
  // console.log(dateRange);
  const handleSwitchField = (value) => value && setField(value);

  const handleSwitchType = (value) => {
    if (value !== null && value !== undefined) {
      setType(value);
      setMatchObj({ ...initMatchObj, ...defaultMatchObj, type_Order: value });
      setField(defaultField);
    }
  };

  //fetch analysis data
  useEffect(() => {
    fetchAnalysisObjs && dispatch(fetchAnalysis({ objs: fetchAnalysisObjs }));
  }, [dispatch, fetchAnalysisObjs]);
  console.log(analysisData);

  // const DateRangeFilter = React.useMemo(
  //   () => (props) =>
  //     (
  //       <FilterDate
  //         key={busType}
  //         type="range"
  //         handleChange={handleSwitchDate}
  //         disabled={!isMB && !allowDateRange}
  //         {...props}
  //       />
  //     ),
  //   [allowDateRange, busType, isMB]
  // );

  return (
    <Container disableGutters sx={{ py: { xs: 1, md: 2 } }}>
      <Grid
        container
        item
        xs={12}
        rowGap={isMB ? 1 : 2}
        columnGap={isMB ? 1 : 2}
        // justifyContent="space-between"
      >
        {/* filter */}
        <DashboardFilter
          busType={busType}
          isMB={isMB}
          size={size}
          showTitle={showTitle}
          showTypeButtons={showTypeButtons}
          typeButtons={typeButtons}
          showFieldButtons={showFieldButtons}
          fieldButtons={fieldButtons}
          dateButtons={dateButtons}
          allowDateRange={allowDateRange}
          dateRange={dateRange}
          // DateRangeFilter={DateRangeFilter}
          handleSwitchDate={handleSwitchDate}
          handleSwitchField={handleSwitchField}
          handleSwitchType={handleSwitchType}
        />
        {/* {fieldSections[field]}
        <FieldSection
          isMB={isMB}
          {...analysisSectionObjs}
          analysisData={analysisData}
        /> */}
        <FieldComponent
          size={size}
          busType={busType}
          analysisData={analysisData}
          type={type}
          isMB={isMB}
          matchObj={matchObj}
          setMatchObj={(field, value) =>
            field && setMatchObj((prev) => ({ ...prev, [field]: value }))
          }
        />
      </Grid>
    </Container>
  );
}

const DashboardFilter = ({
  busType,
  size,
  isMB,
  showTitle,
  showTypeButtons,
  typeButtons,
  showFieldButtons,
  dateButtons,
  handleSwitchType,
  fieldButtons,
  // DateRangeFilter,
  allowDateRange,
  dateRange,
  handleSwitchDate,
  handleSwitchField,
}) => {
  const { t } = useTranslation();
  // const mbDateItems=React.useMemo
  return (
    <Grid container item xs={12} rowGap={isMB ? 1 : 2} columnGap={isMB ? 1 : 2}>
      <Grid sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
        <Paper sx={{ p: 2 }}>
          <Grid container rowGap={2}>
            {/* pc type */}
            {showTypeButtons && (
              <Grid
                container
                item
                // xs={4}
                alignItems="center"
                sx={{
                  display: { xs: "none", md: "inherit" },
                  width: "fit-content",
                  mr: { xs: 0, md: 2 },
                }}
              >
                <Typography sx={{ pr: 2 }}>
                  {t("dashboard.filter.type")}:
                </Typography>
                <CusButtonGroup
                  busType={busType}
                  buttonObjs={typeButtons}
                  handleChange={handleSwitchType}
                />
              </Grid>
            )}
            {/* pc field module */}
            {showFieldButtons && (
              <Grid
                container
                item
                // xs={8}
                alignItems="center"
                sx={{ flex: 1, display: { xs: "none", md: "inherit" } }}
              >
                <Typography sx={{ pr: 2 }}>
                  {t("dashboard.filter.field")}:
                </Typography>
                <CusButtonGroup
                  key={busType}
                  busType={busType}
                  buttonObjs={fieldButtons}
                  handleChange={handleSwitchField}
                />
              </Grid>
            )}
            {/* pc date */}
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              sx={{ display: { xs: "none", md: "inherit" } }}
            >
              <Typography sx={{ pr: 2 }}>
                {t("dashboard.filter.date")}:
              </Typography>
              <CusButtonGroup
                size={size}
                key={busType}
                busType={busType}
                buttonObjs={dateButtons}
                handleChange={handleSwitchDate}
              />
              <Box sx={{ pl: 2 }}>
                <FilterDate
                  key={busType}
                  type="range"
                  handleChange={handleSwitchDate}
                  disabled={!allowDateRange}
                />
              </Box>
            </Grid>
            {/* mb date */}
            <Grid
              container
              item
              xs={6}
              alignItems="center"
              justifyContent="center"
              sx={{ display: { xs: "inherit", md: "none" } }}
            >
              <CusFilterDialog
                key={busType}
                busType={busType}
                label={t("dashboard.filter.date")}
                items={[
                  ...dateButtons?.map((obj) => ({
                    content: obj.label,
                    handleClick: () => handleSwitchDate(obj.value),
                  })),
                  {
                    btnLabel:
                      dateRange && dateRange[0] && dateRange[1]
                        ? `${moment(dateRange[0]).format(
                            "MM/DD/YYYY"
                          )}--${moment(dateRange[1]).format("MM/DD/YYYY")}`
                        : "未选择",
                    getExtraContent: ({ onClose: onFilterModalClose }) => (
                      <FilterDate
                        key={busType}
                        value={dateRange}
                        type="range"
                        handleChange={handleSwitchDate}
                        onClose={() => onFilterModalClose()}
                      />
                    ),
                  },
                ]}
              />
            </Grid>
            {/* mb field module */}
            {showFieldButtons && (
              <Grid
                container
                item
                xs={6}
                alignItems="center"
                justifyContent="center"
                sx={{ display: { xs: "inherit", md: "none" } }}
              >
                <CusFilterDialog
                  key={busType}
                  busType={busType}
                  label={t("dashboard.filter.field")}
                  items={fieldButtons?.map((obj) => ({
                    content: obj.label,
                    handleClick: () => handleSwitchField(obj.value),
                  }))}
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
      {(showTitle || showTypeButtons) && (
        <Grid item xs={12} md={2.5} sx={{ order: { xs: 1, md: 2 } }}>
          <Card
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <CardContent>
              <Grid container item xs={12}>
                <Grid item>
                  <Typography
                    variant="h4"
                    color={`${busType}Mid.main`}
                    sx={{ pb: { xs: 0, md: 1 } }}
                  >
                    {t(`date.${moment().format("ddd")}`)}
                  </Typography>
                  <Typography variant="h5">
                    {moment().format("DD/MM/YYYY")}
                  </Typography>
                </Grid>
                {/* mb type */}
                {showTypeButtons && (
                  <Grid
                    item
                    container
                    flex={1}
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ display: { xs: "inherit", md: "none" } }}
                  >
                    <Typography sx={{ pr: 2 }}>
                      {t("dashboard.filter.type")}:
                    </Typography>
                    <CusButtonGroup
                      busType={busType}
                      size="small"
                      orientation="vertical"
                      buttonObjs={typeButtons}
                      handleChange={handleSwitchType}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};
