const populateObjs = [
  { path: "Client", select: "nome code phone" },
  { path: "Shop", select: "nome code tel addr zip" },
  { path: "Step", select: "typeStep code nome rels" },
  {
    path: "OrderProds",
    select:
      "code Prod OrderSkus nome price_sale is_simple quantity price_regular  price prod_quantity unit iva",
    populate: [
      {
        path: "OrderSkus",
        select: "Sku attrs price_sale quantity price_cost price",
      },
      {
        path: "Prod",
        select: "code nome nomeTR is_simple img_url img_xs price_sale iva",
      },
    ],
  },
  { path: "Paidtype", select: "code nome" },
];

const orderConf = {
  fetchObj: {
    flag: "order",
    api: "/order",
    parentFlag: "orders",
    query: { populateObjs },
  },
  fetchObjs: {
    flag: "orders",
    api: "/orders",
    query: {
      populateObjs,
      sortKey: "at_crt",
      sortVal: -1,
      // crt_after: moment().format("MM/DD/YYYY"),
    },
  },
  fetchObjStep: {
    flag: "order",
    api: "/OrderPutStep",
    parentFlag: "orders",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs, fetchObjStep } = orderConf;
export default orderConf;
