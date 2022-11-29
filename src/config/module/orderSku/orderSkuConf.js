import moment from "moment";

const populateObjs = [
  { path: "Order", select: "code" },
  { path: "Client", select: "nome code" },
  { path: "Supplier", select: "nome code" },
  { path: "Prod", select: "price_cost price_sale" },
];

const orderSkuConf = {
  fetchObjs: {
    flag: "orderSkus",
    api: "/orderSkus",
    query: {
      populateObjs,
    },
  },
};

export { populateObjs };
export const { fetchObjs } = orderSkuConf;
export default orderSkuConf;
