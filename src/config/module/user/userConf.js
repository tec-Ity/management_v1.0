const populateObjs = [];

const userConf = {
  role: {
    1: "owner",
    3: "manager",
    5: "staff",
    101: "boss",
    105: "worker",
  },
  fetchObj: {
    flag: "user",
    api: "/user",
    parentFlag: "users",
    query: { populateObjs },
  },
  fetchObjs: {
    flag: "users",
    api: "/users",
    query: { populateObjs },
  },
};

export const { role, fetchObj, fetchObjs } = userConf;
export { populateObjs };
export default userConf;
