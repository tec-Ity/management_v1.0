const populateObjs = [{ path: "Coin", select: "code nome rate symbol" }];

const paidTypeConf = {
  fetchObj: {
    flag: "paidType",
    api: "/Paidtype",
    parentFlag: "paidTypes",
    query: { populateObjs },
  },
  fetchObjs: {
    flag: "paidTypes",
    api: "/Paidtypes",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = paidTypeConf;
export default paidTypeConf;
