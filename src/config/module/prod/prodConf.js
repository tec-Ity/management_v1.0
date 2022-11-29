const populateObjs = [
  { path: "Attrs", select: "nome options" },
  {
    path: "Skus",
    select: "attrs price_regular price_sale price_cost weight quantity",
  },
  { path: "codeMatchs", select: "code" },
  { path: "Categs", select: "code nome" },
  { path: "Supplier", select: "code" },
];

const prodConf = {
  fetchObj: {
    flag: "prod",
    api: "/prod",
    parentFlag: "prods",
    query: { populateObjs },
  },
  fetchObjs: {
    flag: "prods",
    api: "/prods",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = prodConf;
export default prodConf;
