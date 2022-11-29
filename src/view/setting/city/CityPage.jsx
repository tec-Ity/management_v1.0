import React from "react";
import CusItemList from "../../../component/list/CusItemList";
import { fetchObjs, fetchObj } from "../../../config/module/city/cityConf";
import cityFormInputs from "../../../config/module/city/cityFormInputs";

export default function CityPage() {
  return (
    <CusItemList
      formInputs={cityFormInputs}
      fetchObjs={fetchObjs}
      fetchObj={fetchObj}
    />
  );
}
