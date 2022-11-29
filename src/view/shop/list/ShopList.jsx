import React from "react";
import { fetchObj, fetchObjs } from "../../../config/module/shop/shopConf";
import shopFormInputs, {
  shopFormImg,
} from "../../../config/module/shop/shopFormInputs";
import CusItemList from "../../../component/list/CusItemList";
export default function shopList() {
  return (
    <CusItemList
      formInputs={shopFormInputs}
      fileInput={shopFormImg}
      fetchObjs={fetchObjs}
      fetchObj={fetchObj}
    />
  );
}
