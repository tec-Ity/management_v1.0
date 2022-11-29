const populateObjs = [
  { path: "Attrs", select: "nome options" },
  { path: "Skus", select: "attrs price_regular price_sale" },
];

const supConf = {
  fetchObj: {
    flag: "sup",
    api: "/supplier",
    parentFlag: "sups",
    query: { populateObjs },
  },
  fetchObjs: {
    flag: "sups",
    api: "/suppliers",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = supConf;
export default supConf;
