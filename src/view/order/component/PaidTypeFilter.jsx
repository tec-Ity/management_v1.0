import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import CusFilterDialog from "../../../component/filter/CusFilterDialog";
import { fetchObjs as fetchObjsPaidType } from "../../../config/module/setting/payment/type/paidTypeConf";
import { getObjects, selectObjects, setQuery } from "../../../redux/fetchSlice";

export default function PaidTypeFilter({ fetchObjs, ...rest }) {
  const dispatch = useDispatch();
  const paidTypes = useSelector(selectObjects(fetchObjsPaidType.flag));

  React.useEffect(() => {
    dispatch(getObjects({ fetchObjs: fetchObjsPaidType }));
    return () =>
      dispatch(
        setQuery({ fetchObjs, query: { Paidtypes: [null] }, isRemove: true })
      );
  }, [dispatch]);

  const handleClick = React.useCallback(
    (id) => {
      // console.log(id);
      dispatch(setQuery({ fetchObjs, query: { Paidtypes: [id] } }));
    },
    [dispatch, fetchObjs]
  );

  const items = React.useMemo(
    () => [
      { content: "全部", handleClick: () => handleClick(null) },
      ...paidTypes?.map((paidType) => ({
        content: paidType.code,
        handleClick: () => handleClick(paidType._id),
      })),
    ],
    [handleClick, paidTypes]
  );
  // console.log(paidTypes);
  return <CusFilterDialog label="支付" items={items} {...rest} />;
}
