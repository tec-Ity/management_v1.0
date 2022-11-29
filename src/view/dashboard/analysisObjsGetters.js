import getPrice from "../../utils/price/getPrice";

const renderRows = (groupData) =>
  groupData?.map((data, index) => {
    const dataTemp = { ...data };
    if (typeof dataTemp._id !== "string") {
      delete dataTemp._id;
      const newId =
        data?._id && data._id.length > 0 ? { ...data?._id[0] } : { _id: index };
      return { ...dataTemp, ...newId, index: index + 1 };
    }
    return { ...data, index: index + 1 };
  });

const generalGetter = (matchObj) => ({
  dataGridObj: {
    columns: [
      { field: "nome", headerName: "formField.nome", width: 200 },
      // { field: "nomeTR", headerName: "formField.nomeTR" },
      {
        field: "prod_sale",
        headerName: "formField.price_sale",
        renderCell: (params) => getPrice(params.value),
      },
      { field: "prod_quantity", headerName: "dashboard.product.prodQuantity" },
    ],
    rows: renderRows,
  },
  fetchAnalysisObjs: [
    {
      key: "singleData",
      dbName: "Order",
      pipeline: {
        matchObj,
        groupObj: {
          outputs: [
            "order_quantity",
            "order_regular",
            "order_imp",
            "goods_quantity",
          ],
        },
      },
    },
    {
      key: "spanData",
      dbName: "Order",
      pipeline: {
        field: "at_crt",
        is_interval: true,
        matchObj,
        bucketObj: {
          is_at: true,
          atObj: { start: matchObj.crt_after, end: matchObj.crt_before },
          outputs: [
            "order_quantity",
            "order_regular",
            "order_imp",
            "goods_quantity",
          ],
        },
      },
    },
    {
      key: "groupData",
      dbName: "OrderProd",
      pipeline: {
        field: "Prod",
        matchObj,
        groupObj: {
          outputs: ["prod_sale", "prod_quantity"],
        },
        sortObj: { prod_quantity: -1 },
      },
    },
  ],
});

const orderProdGetter = (matchObj) => ({
  dataCardObjs: [
    {
      label: "dashboard.product.prodPrice",
      dataField: "prod_sale",
      renderData: (data) => getPrice(data),
    },
    {
      label: "dashboard.product.prodQuantity",
      dataField: "prod_quantity",
    },
  ],
  dataGridObj: {
    columns: [
      { field: "nome", headerName: "formField.nome", width: 200 },
      // { field: "nomeTR", headerName: "formField.nomeTR" },
      {
        field: "prod_sale",
        headerName: "formField.price_sale",
        renderCell: (params) => getPrice(params.value),
      },
      { field: "prod_quantity", headerName: "dashboard.product.prodQuantity" },
      {
        field: "prod_sale",
        headerName: "formField.price_sale",
        renderCell: (params) => getPrice(params.value),
      },
    ],
    rows: renderRows,
  },
  fetchAnalysisObjs: [
    {
      key: "singleData",
      dbName: "OrderProd",
      pipeline: {
        matchObj,
        groupObj: {
          outputs: ["prod_sale", "prod_quantity"],
        },
      },
    },
    {
      key: "groupData",
      dbName: "OrderProd",
      pipeline: {
        field: "Prod",
        matchObj,
        groupObj: {
          outputs: ["prod_sale", "prod_quantity"],
        },
        sortObj: { prod_quantity: -1 },
      },
    },
  ],
});

const paidTypeGetter = (matchObj) => ({
  dataCardObjs: [
    {
      label: "dashboard.general.orderPrice",
      dataField: "order_imp",
      renderData: (data) => getPrice(data),
    },
    { label: "dashboard.general.orderCount", dataField: "count" },
    {
      label: "dashboard.general.orderProducts",
      dataField: "goods_quantity",
      renderData: (data) => getPrice(data),
    },
  ],
  dataGridObj: {
    columns: [
      {
        field: "order_imp",
        headerName: "dashboard.paidType.totPay",
        renderCell: (params) => getPrice(params.value),
      },
      { field: "count", headerName: "dashboard.paidType.count" },
    ],
    rows: renderRows,
  },
  fetchAnalysisObjs: [
    {
      key: "singleData",
      dbName: "Order",
      pipeline: {
        matchObj,
        groupObj: {
          outputs: [
            "order_quantity",
            "order_regular",
            "order_imp",
            "goods_quantity",
          ],
        },
      },
    },
    {
      key: "groupData",
      dbName: "Order",
      pipeline: {
        matchObj,
        field: "Paidtype", //code?
        groupObj: {
          outputs: ["price_coin"],
        },
      },
    },
  ],
});

const clientGetter = (matchObj) => ({
  dataCardObjs: [
    {
      label: "dashboard.general.orderPrice",
      dataField: "order_imp",
      renderData: (data) => getPrice(data),
    },
    { label: "dashboard.general.orderCount", dataField: "count" },
    {
      label: "dashboard.general.orderProducts",
      dataField: "goods_quantity",
      renderData: (data) => getPrice(data),
    },
  ],
  dataGridObj: {
    columns: [],
    rows: renderRows,
  },
  fetchAnalysisObjs: [
    {
      key: "singleData",
      dbName: "Order",
      pipeline: {
        matchObj,
        groupObj: {
          outputs: [
            "order_quantity",
            "order_regular",
            "order_imp",
            "goods_quantity",
          ],
        },
      },
    },
    {
      key: "groupData",
      dbName: "Order",
      pipeline: {
        matchObj,
        field: "Client",
        groupObj: {
          outputs: ["price_coin"],
        },
      },
    },
  ],
});

const coinGetter = (matchObj) => ({
  dataCardObjs: [
    {
      label: "dashboard.general.orderPrice",
      dataField: "order_imp",
      renderData: (data) => getPrice(data),
    },
    { label: "dashboard.general.orderCount", dataField: "count" },
    {
      label: "dashboard.general.orderProducts",
      dataField: "goods_quantity",
      renderData: (data) => getPrice(data),
    },
  ],
  dataGridObj: {
    columns: [{ field: "_id", headerName: "formField.symbol" }],
    rows: renderRows,
  },
  fetchAnalysisObjs: [
    {
      key: "singleData",
      dbName: "Order",
      pipeline: {
        matchObj,
        groupObj: {
          outputs: [
            "order_quantity",
            "order_regular",
            "order_imp",
            "goods_quantity",
          ],
        },
      },
    },
    {
      key: "groupData",
      dbName: "Order",
      pipeline: {
        matchObj,
        field: "symbol",
        groupObj: {
          outputs: [
            "order_quantity",
            "order_regular",
            "order_imp",
            "goods_quantity",
          ],
        },
      },
    },
  ],
});

const analysisObjsGetters = {
  general: generalGetter,
  orderProd: orderProdGetter,
  paidType: paidTypeGetter,
  client: clientGetter,
  coin: coinGetter,
};
export default analysisObjsGetters;
