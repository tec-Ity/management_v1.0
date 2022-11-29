const populateObjs = [];

const clientConf = {
  fetchObj: {
    flag: "client",
    api: "/client",
    parentFlag: "clients",
    // query: { populateObjs },
  },
  fetchObjs: {
    flag: "clients",
    api: "/clients",
    // query: { populateObjs },
  },
};

export const { fetchObj, fetchObjs } = clientConf;
export { populateObjs };
export default clientConf;
