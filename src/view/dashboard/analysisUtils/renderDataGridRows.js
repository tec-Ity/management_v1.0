const renderRows = (groupData) =>
  groupData?.map((data, index) => {
    const dataTemp = { ...data };
    if (typeof dataTemp._id !== "string") {
      delete dataTemp._id;
      const newId =
        data?._id && data._id.length > 0 ? { ...data?._id[0] } : { _id: index };
      return { ...dataTemp, ...newId, index: index + 1 };
    }
    return { ...data, index: index + 1 };
  });
export default renderRows;
