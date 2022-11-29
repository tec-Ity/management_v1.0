import React from "react";
import CusItemList from "../../../component/list/CusItemList";
import {
  fetchObjs,
  fetchObj,
} from "../../../config/module/setting/payment/coin/coinConf";
import coinFormInputs from "../../../config/module/setting/payment/coin/coinFormInputs";
import PaidIcon from "@mui/icons-material/Paid";
import SettingHeader from "../component/SettingHeader";
export default function CoinPage() {
  return (
    <>
      <SettingHeader title="coin" />
      <CusItemList
        formInputs={coinFormInputs}
        fetchObjs={fetchObjs}
        fetchObj={fetchObj}
        CardImage={PaidIcon}
        title="coin"
      />
    </>
  );
}
