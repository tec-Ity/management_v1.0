import React from "react";
import { useSelector } from "react-redux";
import ProdAttr from "./ProdAttr";
import ProdSku from "./ProdSku";
import { fetchObj } from "../../../config/module/prod/prodConf";
import CusItemDetail from "../../../component/detail/CusItemDetail.jsx";
import ProdStock from "./ProdStock";
import prodFormInputs, {
  prodFormImg,
} from "../../../config/module/prod/prodFormInputs";
export default function ProdDetail(props) {
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const components = [ProdStock, ProdAttr, ProdSku];

  const groupButtons = [
    { label: isMB ? "记录" : "商品记录", value: 1 },
    { label: "规格管理", value: 2, width: isMB ? 80 : null },
    { label: "规格商品", value: 3, width: isMB ? 80 : null },
  ];

  return (
    <CusItemDetail
      {...props}
      components={components}
      groupButtons={groupButtons}
      fetchObj={fetchObj}
      formInputs={prodFormInputs}
      formImg={prodFormImg}
      title="商品"
    />
  );
}
