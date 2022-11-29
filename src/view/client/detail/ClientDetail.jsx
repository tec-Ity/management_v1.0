import React from "react";
import { useSelector } from "react-redux";
import { fetchObj } from "../../../config/module/client/clientConf";
import CusItemDetail from "../../../component/detail/CusItemDetail.jsx";
import clientFormInputs, {
  clientFormImg,
} from "../../../config/module/client/clientFormInputs";
import ClientOrder from "./ClientOrder";
import ClientProds from "./ClientProds";
export default function ClientDetail(props) {
  const components = [ClientOrder, ClientProds];

  const groupButtons = [
    { label: "订单记录", value: 1 },
    { label: "商品记录", value: 2 },
  ];

  return (
    <CusItemDetail
      {...props}
      components={components}
      groupButtons={groupButtons}
      fetchObj={fetchObj}
      formInputs={clientFormInputs}
      formImg={clientFormImg}
      title="会员"
    />
  );
}
