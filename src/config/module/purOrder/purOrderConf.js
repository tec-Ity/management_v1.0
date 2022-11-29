import moment from "moment";

const populateObjs = [
  { path: "Supplier", select: "nome code" },
  {
    path: "OrderProds",
    select:
      "code Prod OrderSkus nome price_sale price_cost is_simple quantity price_regular  price prod_quantity unit",
    populate: [
      {
        path: "OrderSkus",
        select: "Sku attrs price_sale quantity price_cost price",
      },
      {
        path: "Prod",
        select:
          "code nome nomeTR is_simple img_url img_xs price_cost price_sale",
      },
    ],
  },
  { path: "Paidtype", select: "code nome" },
];

const purOrderConf = {
  fetchObj: {
    flag: "purOrder",
    api: "/order",
    parentFlag: "purOrders",
    query: { populateObjs, type_Order: 1 },
  },
  fetchObjs: {
    flag: "purOrders",
    api: "/orders",
    query: {
      populateObjs,
      type_Order: 1,
      sortKey: "at_crt",
      sortVal: -1,
    },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = purOrderConf;
export default purOrderConf;
