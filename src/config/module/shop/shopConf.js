const populateObjs = [
  // { path: "Attrs", select: "nome options" },
  // { path: "Skus", select: "attrs price_regular price_sale" },
];

const shopConf = {
  fetchObj: {
    flag: "shop",
    api: "/shop",
    parentFlag: "shops",
    query: { populateObjs },
  },
  fetchObjs: {
    flag: "shops",
    api: "/shops",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = shopConf;
export default shopConf;
