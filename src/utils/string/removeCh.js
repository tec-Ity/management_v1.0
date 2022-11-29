const removeCh = (string) => {
  try {
    const reg = /[\u4e00-\u9fa5]/g;
    return string.replace(reg, "");
  } catch (e) {
    console.log(e);
  }
};
export default removeCh;
