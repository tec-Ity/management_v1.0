import React from "react";
import { axios_Prom } from "../../../api/api";
import SettingHeader from "../component/SettingHeader";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useState } from "react";
import CusButtonGroup from "../../../component/buttonGroup/CusButtonGroup";
import { t } from "i18next";
import moment from "moment/moment";
import CusDataGrid from "../../../component/dataGrid/CusDataGrid";
import getPrice from "../../../utils/price/getPrice";

const renderObject = (params, type) => {
  const { val, valPre } = params?.value || {};
  const newVal = type === "price" ? getPrice(val) : val;
  const newValPre = type === "price" ? getPrice(valPre) : valPre;
  if (!val) return newValPre;
  else
    return (
      <Box>
        <Typography>
          {newValPre} {" ->"}
        </Typography>
        <Typography color="error.main">{newVal}</Typography>
      </Box>
    );
};

const genQuery = (query) => {
  return Object.keys(query)
    ?.map((key) => `${key}=${query[key]}`)
    ?.join("&");
};
export default function Record() {
  const buttons = [
    { label: t("nav.orders"), value: "Order" },
    { label: t("nav.prods"), value: "Prod" },
  ];
  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState("Order");
  const [query, setQuery] = useState({
    dbName: type,
    pageSize: 50,
    page: 1,
    sortKey: "at_crt",
    sortVal: -1,
  });

  const onPageStateChange = (pageState) => {
    setQuery((prev) => ({
      ...prev,
      page: pageState.page + 1,
      pagesize: pageState.pageSize,
    }));
  };

  React.useEffect(() => {
    async function getRecords() {
      console.log(query);
      const res = await axios_Prom(`/Records?${genQuery(query)}`);
      console.log(res);
      if (res.status === 200) {
        const newRecords = [];
        res.data.objects?.forEach((obj) => {
          // if (obj.dbName !== type) return;
          const { datas, ...rest } = obj;
          const newObj = rest;
          datas.forEach((data) => {
            newObj[data.field] = {
              val: data.val,
              valPre: data.valPre,
            };
          });
          newRecords.push(newObj);
        });
        setRecords(newRecords);
        setCount(res.data.count);
      }
    }
    getRecords();
  }, [query]);

  const baseColumns = [
    {
      field: "index",
      headerName: t("formField.index"),
      width: 60,
    },
    // {
    //   field: "dbName",
    //   headerName: t("dashboard.filter.type"),
    //   width: 60,
    //   renderCell: (params) => t(`record.${params.value}`),
    // },
    {
      field: "is_Delete",
      headerName: "操作",
      width: 60,
      renderCell: (params) => (params.value ? "删除" : "修改"),
    },
    {
      field: "at_crt",
      headerName: t("formField.at_handle"),
      width: 170,
      renderCell: (params) =>
        moment(params.value).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      field: "code",
      headerName: t("formField.code"),
      renderCell: renderObject,
      width: 170,
    },
  ];

  const typeColumns = {
    Order: [
      {
        field: "type_Order",
        headerName: "订单类型",
        renderCell: (params) => (params.value === 1 ? "采购" : "销售"),
      },
      {
        field: "order_imp",
        headerName: "付款金额",
        type: "price",
      },
    ],
    Prod: [
      {
        field: "nome",
        headerName: t("formField.nome"),
        width: 170,
      },
      {
        field: "nomeTR",
        headerName: t("formField.nomeTR"),
        width: 170,
      },
      {
        field: "quantity",
        headerName: t("formField.quantity"),
      },
      {
        field: "price_cost",
        headerName: t("formField.price_cost"),
        type: "price",
      },
      {
        field: "price_regular",
        headerName: t("formField.price_regular"),
        type: "price",
      },
    ],
  }[type];

  const columns = [
    ...baseColumns,
    ...typeColumns?.map((col) => ({
      renderCell: (params) => renderObject(params, col.type),
      ...col,
    })),
  ];
  console.log(records);
  return (
    <>
      <SettingHeader title="record" />
      <Card sx={{ width: "100%", p: 1 }}>
        <Grid container rowSpacing={3}>
          <Grid container item xs={12} alignItems="center">
            <Typography variant="6h" sx={{ m: 3 }}>
              选择类型:
            </Typography>
            <CusButtonGroup
              buttonObjs={buttons}
              handleChange={(value) => {
                setType(value);
                setQuery((prev) => ({ ...prev, dbName: value }));
              }}
            />
          </Grid>
          <Grid container item xs={12} sx={{ minHeight: 500 }}>
            <CusDataGrid
              columns={columns}
              rows={records}
              count={count}
              defaultPageState={{ page: 0, pageSize: 50 }}
              onPageStateChange={onPageStateChange}
            />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
