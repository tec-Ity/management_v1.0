const populateObjs = [];

const coinConf = {
  fetchObj: {
    flag: "coin",
    api: "/coin",
    parentFlag: "coins",
    // query: { populateObjs },
  },
  fetchObjs: {
    flag: "coins",
    api: "/coins",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = coinConf;
export default coinConf;
