import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProds, fetchProdsUpdate } from "./reducer/ProdStorageSlice";
import LoadingModal from "../../component/modal/LoadingModal";

export default function ProdStorage() {
  const dispatch = useDispatch();
  const getStatus = useSelector((state) => state.prodStorage.getStatus);
  const isLogin = useSelector((state) => state.auth.isLogin);
  // const lastUpdateTime = useSelector(
  //   (state) => state.prodStorage.lastUpdateTime
  // );
  const updatePeriod = useSelector((state) => state.prodStorage.updatePeriod);
  useEffect(() => {
    // console.log(isLogin);
    if (isLogin) {
      dispatch(fetchProds());
      setInterval(() => {
        // console.log(1111111111111);
        dispatch(fetchProdsUpdate());
      }, updatePeriod);
    }
  }, [dispatch, isLogin]);

  return (
    <>
      <LoadingModal open={Boolean(getStatus === "loading")} />
    </>
  );
}
