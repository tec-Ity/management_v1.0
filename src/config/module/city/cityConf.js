const populateObjs = [];

const cityConf = {
  fetchObj: {
    flag: "Cita",
    api: "/Cita",
    parentFlag: "Citas",
    // query: { populateObjs },
  },
  fetchObjs: {
    flag: "Citas",
    api: "/Citas",
    query: { populateObjs },
  },
};

export { populateObjs };
export const { fetchObj, fetchObjs } = cityConf;
export default cityConf;
