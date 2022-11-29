import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CusDataGrid from "../../../component/dataGrid/CusDataGrid";
import { fetchObjs as orderProdFetchObjs } from "../../../config/module/orderProd/orderProdConf";
import { fetchObjs as orderSkuFetchObjs } from "../../../config/module/orderSku/orderSkuConf";
import { fetchObjs as clientFetchObjs } from "../../../config/module/client/clientConf";
import { fetchObjs as supplierFetchObjs } from "../../../config/module/supplier/supConf";

import {
  getObjects,
  selectObjects,
  selectObjectsCount,
  setQuery,
} from "../../../redux/fetchSlice";

import getPrice from "../../../utils/price/getPrice";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CusButtonGroup from "../../../component/buttonGroup/CusButtonGroup";
import FilterDate from "../../../component/filter/FilterDate";
import FormAutoComplete from "../../../component/form/FormAutoComplete";
import { fetchAnalysis } from "../../dashboard/analysisSlice";

const getRowsExtra = (obj) => ({
  price_sale: obj.Prod?.price_sale,
  price_cost: obj.Prod?.price_cost,
  // ...(obj.type === 1
  //   ? { Supplier: obj.Supplier?.nome }
  //   : { Client: obj.Client?.nome }),
});

const buttonObjs = [
  { label: "销售", value: 0 },
  { label: "采购", value: 1 },
];

const renderPrice = (params) => (
  <Typography noWrap title={params.value}>
    {getPrice(params.value)}
  </Typography>
);
const initFilter = {
  crt_before: "",
  crt_after: "",
  Supplier: "",
  Client: "",
  Suppliers: "",
  Clients: "",
  is_virtual: false,
};
const basicAnalysisObj = {
  key: "prodStock",
  dbName: "OrderProd",
  pipeline: {
    field: "Prod",
    // matchObj,
    groupObj: {
      outputs: ["prod_sale", "prod_quantity"],
    },
    sortObj: { prod_quantity: -1 },
  },
};

export default function ProdStock({ _id, isMB, obj: prod }) {
  const is_simple = prod.is_simple;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [typeOrder, setTypeOrder] = useState(-1);
  const fetchObjs = React.useMemo(
    () => (is_simple ? orderProdFetchObjs : orderSkuFetchObjs),
    [is_simple]
  );
  const [filter, setFilter] = useState(initFilter);
  const ops = useSelector(selectObjects(fetchObjs.flag));
  const count = useSelector(selectObjectsCount(fetchObjs.flag));
  const analysisData = useSelector((state) => state.analysis.analysisData);
  const prodStock = analysisData?.prodStock ? analysisData?.prodStock[0] : {};
  const { prod_quantity, prod_sale } = prodStock || {};
  console.log(ops, analysisData);
  const getFetchAnalysis = ({ filter, typeOrder }) => {
    const { crt_after, crt_before, Supplier, Client } = filter;
    const matchObj = { Prod: _id, type_Order: typeOrder, is_virtual: false };
    if (crt_after) matchObj.crt_after = crt_after;
    if (crt_before) matchObj.crt_before = crt_before;
    if (Supplier) matchObj.Supplier = Supplier;
    if (Client) matchObj.Client = Client;
    dispatch(
      fetchAnalysis({
        objs: [
          {
            ...basicAnalysisObj,
            pipeline: {
              ...basicAnalysisObj.pipeline,
              matchObj,
            },
          },
        ],
      })
    );
  };

  const handleFilter = () => {
    dispatch(
      setQuery({
        fetchObjs,
        query: {
          ...filter,
          Suppliers: [filter.Supplier],
          Clients: [filter.Client],
        },
      })
    );
    dispatch(getObjects({ fetchObjs }));
    getFetchAnalysis({ filter, typeOrder });
  };

  useEffect(() => {
    dispatch(
      setQuery({
        fetchObjs,
        query: { Prod: _id, type_Order: typeOrder, ...initFilter },
      })
    );
    dispatch(getObjects({ fetchObjs }));
    getFetchAnalysis({ filter, typeOrder });
  }, [_id, dispatch, typeOrder, fetchObjs]);

  const columns = [
    { field: "index", width: 60, headerName: t("formField.index") },
    {
      field: "at_crt",
      headerName: "日期",
      width: 150,
      renderCell: (params) =>
        params?.value && moment(params.value).format("MM-DD-YYYY HH:mm"),
    },
    {
      field: "price",
      headerName: typeOrder === 1 ? "本次进价" : "本次卖价",
      renderCell: renderPrice,
    },
    {
      field: "quantity",
      width: 80,
      headerName: t("formField.count"),
    },
    {
      field: "price_sale",
      headerName: t("formField.price_sale"),
      renderCell: renderPrice,
    },
    {
      field: "price_cost",
      headerName: t("formField.price_cost"),
      renderCell: renderPrice,
    },
    {
      field: "Order",
      headerName: "订单编号",
      width: 150,
      renderCell: (params) => params.value?.code,
    },
    typeOrder === 1
      ? {
          field: "Supplier",
          width: 150,
          headerName: t("formField.Supplier"),
          renderCell: (params) =>
            params.value ? params.value.code + "-" + params.value.nome : "无",
        }
      : {
          field: "Client",
          width: 150,
          headerName: t("formField.Client"),
          renderCell: (params) =>
            params.value ? params.value.code + "-" + params.value.nome : "散客",
        },
  ];

  if (is_simple === false) {
    columns.splice(1, 0, { field: "attrs", width: 150, headerName: "规格" });
  }

  return (
    <Grid container justifyContent="space-between" rowGap={2}>
      <Grid item xs={12} md={3}>
        <CusButtonGroup
          busType="sale"
          size="small"
          buttonObjs={buttonObjs}
          handleChange={(val) => {
            val === 1 ? setTypeOrder(1) : setTypeOrder(-1);
            setFilter(initFilter);
          }}
          sx={{ mb: { xs: 0, md: 2 } }}
        />
      </Grid>
      <Grid
        container
        item
        xs={12}
        md={8}
        columnSpacing={2}
        rowSpacing={isMB ? 1 : 0}
        justifyContent={isMB ? "flex-start" : "flex-end"}
        // sx={{ mb: isMB && 2 }}
      >
        <Grid item>
          <FilterDate
            key={typeOrder === 1 ? "supFD" : "CliFD"}
            type="range"
            // value={[filter.crt_before, filter.crt_after]}
            handleChange={(range) => {
              setFilter((prev) => ({
                ...prev,
                crt_after: moment(range[0]).format("MM/DD/YYYY"),
                crt_before: moment(range[1]).format("MM/DD/YYYY"),
              }));
            }}
          />
        </Grid>
        <Grid item sx={{ width: 150 }}>
          <FormAutoComplete
            key={typeOrder === 1 ? "supAC" : "CliAC"}
            size="small"
            variant="outlined"
            optionLabel="nome"
            optionValue="_id"
            value={(typeOrder === 1 ? filter.Supplier : filter.Client) || ""}
            label={typeOrder === 1 ? "供应商" : "客户"}
            fetchObjs={typeOrder === 1 ? supplierFetchObjs : clientFetchObjs}
            handleChange={(val) => {
              console.log(11111, val);
              setFilter((prev) => ({
                ...prev,
                [typeOrder === 1 ? "Supplier" : "Client"]: val,
              }));
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleFilter}>
            确认
          </Button>
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        <Box sx={{ display: "flex" }}>
          <Typography>总销量：{prod_quantity || 0}</Typography>
          <Typography sx={{ ml: 2 }}>
            总销售额：{getPrice(prod_sale)}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ flex: 1, height: 400 }}>
        <CusDataGrid
          rows={ops}
          columns={columns}
          count={count}
          getRowsExtra={getRowsExtra}
        />
      </Grid>
    </Grid>
  );
}
