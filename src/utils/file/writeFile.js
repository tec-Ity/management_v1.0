const writeFile = (content, name, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name || !path || !content) return false;
      const res = await window.electron?.fileApi.writeFile(
        name,
        path,
        content,
        (data) => console.log(222, data)
      );
      // console.log(111, res);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};
export default writeFile;
