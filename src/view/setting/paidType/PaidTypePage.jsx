import React from "react";
import CusItemList from "../../../component/list/CusItemList";
import {
  fetchObjs,
  fetchObj,
} from "../../../config/module/setting/payment/type/paidTypeConf";
import paidTypeFormInputs from "../../../config/module/setting/payment/type/paidTypeFormInputs";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SettingHeader from "../component/SettingHeader";
export default function PaidTypePage() {
  return (
    <>
      <SettingHeader title={"paidType"} />
      <CusItemList
        formInputs={paidTypeFormInputs}
        fetchObjs={fetchObjs}
        fetchObj={fetchObj}
        CardImage={PointOfSaleIcon}
        // title="paidType"
      />
    </>
  );
}
