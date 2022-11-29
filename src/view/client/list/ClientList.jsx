import React from "react";
//config
import clientFormInputs, {
  clientFormImg,
} from "../../../config/module/client/clientFormInputs";
import { fetchObjs as fetchObjsOrder } from "../../../config/module/order/orderConf";
import {
  fetchObjs as fetchObjsClient,
  fetchObj as fetchObjClient,
} from "../../../config/module/client/clientConf";

//component
import CusSubjectListCombine from "../../../component/list/CusSubjectListCombine";
import ClientCardUI from "../component/ClientCardUI.jsx";
import ClientDetailUI from "../component/ClientDetailUI.jsx";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CusDialog from "../../../component/modal/CusDialog";
import ClientDetail from "../detail/ClientDetail";

export default function ClientList({ section = 1 }) {
  return (
    <CusSubjectListCombine
      busType="sale"
      section={section}
      subjectFetchObj={fetchObjClient}
      subjectFetchObjs={fetchObjsClient}
      orderFetchObjs={fetchObjsOrder}
      subjectFormInputs={clientFormInputs}
      // subjectFormImg={clientFormImg}
      frontListTitle={"会员中心"}
      listNoneMsg={"暂无会员"}
      detailTitle={"会员详情"}
      postTitle={"添加会员"}
      backListTitle={"clients"}
      queryParam={"Clients"}
      SubjectCardUI={ClientCardUI}
      SubjectDetailUI={ClientDetailUI}
      CardImage={PersonOutlineIcon}
      CustomPutModal={({ objectId, onClose, ...rest }) => (
        <CusDialog
          onClose={onClose}
          {...rest}
          content={<ClientDetail _id={objectId} onClose={onClose} />}
        />
      )}
    />
  );
}
