const populateObjs = [
  { path: "Categ_sons", select: "code nome Categ_far" },
  { path: "Categ_far", select: "code nome" },
];
const categConf = {
  fetchObjs: {
    flag: "Categs",
    api: "/Categs",
    query: { populateObjs },
  },
  fetchObj: {
    flag: "Categ",
    api: "/Categ",
    parentFlag: "Categs",
    query: { populateObjs },
  },
};

//1st categ fetchs
categConf.fetchObjsFst = {
  ...categConf.fetchObjs,
  query: { ...categConf.fetchObjs.query, level: 1 },
};
//1st categ fetch
categConf.fetchObjFst = {
  ...categConf.fetchObj,
  query: { ...categConf.fetchObj.query, level: 1 },
};

//2nd categ fetchs
categConf.fetchObjsSec = {
  ...categConf.fetchObjs,
  query: { ...categConf.fetchObjs.query, level: 2 },
};

//2nd categ fetch
categConf.fetchObjSec = {
  ...categConf.fetchObj,
  asField: "Categ_sons",
  parentField: "Categ_far",
  query: { ...categConf.fetchObj.query, level: 2 },
};
export default categConf;
export const {
  fetchObj,
  fetchObjs,
  fetchObjsFst,
  fetchObjFst,
  fetchObjsSec,
  fetchObjSec,
} = categConf;
