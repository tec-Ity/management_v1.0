const generalGetter = (matchObj, key) => {
  const obj = {
    singleData: {
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
    groupData: {
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
  };

  if (!key) return [obj.groupData, obj.singleData];
  else return [obj[key]];
};

const orderProdGetter = (matchObj) => [
  {
    key: "singleData",
    dbName: "OrderProd",
    pipeline: {
      matchObj,
      groupObj: {
        outputs: ["prod_sale", "prod_quantity", "prod_price"],
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
        outputs: ["prod_sale", "prod_quantity", "prod_price"],
      },
      sortObj: { prod_quantity: -1 },
    },
  },
];

const subjectGetter = (matchObj) => [
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
      field: matchObj.type_Order === 1 ? "Supplier" : "Client",
      groupObj: {
        outputs: ["order_imp"],
      },
      sortObj: { order_imp: -1 },
    },
  },
];

const paidTypeGetter = (matchObj) => [
  {
    key: "singleData",
    dbName: "Order",
    pipeline: {
      matchObj,
      groupObj: {
        outputs: [],
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
        outputs: ["order_imp", "price_coin"],
      },
      sortObj: { order_imp: -1 },
    },
  },
  {
    key: "coinData",
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
          "price_coin",
        ],
      },
      sortObj: { order_imp: -1 },
    },
  },
];

const coinGetter = (matchObj) => [
  {
    key: "singleData",
    dbName: "Order",
    pipeline: {
      matchObj,
      groupObj: {
        outputs: [],
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
      sortObj: { order_imp: -1 },
    },
  },
];

const fetchAnalysisObjsGetters = {
  general: generalGetter,
  orderProd: orderProdGetter,
  subject: subjectGetter,
  paidType: paidTypeGetter,
  coin: coinGetter,
};
export default fetchAnalysisObjsGetters;
