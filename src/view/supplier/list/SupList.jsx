import React from "react";
import { fetchObj, fetchObjs } from "../../../config/module/supplier/supConf";
import supFormInputs, {
  supFormImg,
} from "../../../config/module/supplier/supFormInputs";
import { fetchObjs as purOrderFetchObjs } from "../../../config/module/purOrder/purOrderConf";
import CusSubjectListCombine from "../../../component/list/CusSubjectListCombine";
import ClientCardUI from "../../client/component/ClientCardUI";
import ClientDetailUI from "../../client/component/ClientDetailUI";
import supIcon from "../../../assets/icons/supplierIcon.png";
import { Box } from "@mui/material";
export default function SupList({ section = 1 }) {
  return (
    <CusSubjectListCombine
      busType="purchase"
      section={section}
      subjectFetchObj={fetchObj}
      subjectFetchObjs={fetchObjs}
      orderFetchObjs={purOrderFetchObjs}
      subjectFormInputs={supFormInputs}
      // subjectFormImg={supFormImg}
      frontListTitle={"供应商"}
      listNoneMsg={"暂无供应商"}
      detailTitle={"供应商详情"}
      postTitle={"添加供应商"}
      backListTitle={"suppliers"}
      queryParam={"Supplier"}
      SubjectCardUI={ClientCardUI}
      SubjectDetailUI={ClientDetailUI}
      postDefaultValue={{ Firm: "Supplier" }}
      CardImage={(props) => <Box component="img" src={supIcon} {...props} />}
      dataGridProps={{ columns: [{ field: "contact", headerName: "contact" }] }}
    />
  );
}
