import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FieldSection from "../FieldSection.jsx";
import getPrice from "../../../utils/price/getPrice";
import renderRows from "../analysisUtils/renderDataGridRows.js";
import { fetchObjs as clientFetchObjs } from "../../../config/module/client/clientConf";
import { fetchObjs as supplierFetchObjs } from "../../../config/module/supplier/supConf";
import { getObjects, selectObjectsCount } from "../../../redux/fetchSlice";
export default function SubjectField({ analysisData, type, isMB, matchObj }) {
  const dispatch = useDispatch();
  const fetchObjs = type === 1 ? supplierFetchObjs : clientFetchObjs;
  const subjectName = type === 1 ? "supplier" : "client";
  const subjectCount = useSelector(selectObjectsCount(fetchObjs.flag));
  const newSubjectFlag = "newSubject";
  const subjectCountNew = useSelector(selectObjectsCount(newSubjectFlag));

  useEffect(() => {
    //new subject
    dispatch(
      getObjects({
        fetchObjs: {
          ...fetchObjs,
          flag: newSubjectFlag,
          query: { crt_after: matchObj.crt_after },
        },
      })
    );
    // total subject
    dispatch(
      getObjects({
        fetchObjs,
      })
    );
  }, [type, matchObj]);

  let notVipCount = 0,
    notVipPrice = 0;

  analysisData.groupData?.forEach((client) => {
    if (!client._id || client._id.length === 0) {
      notVipCount = client.count;
      notVipPrice = client.order_imp;
    }
  });

  const dataCardObjs = [
    {
      label: `dashboard.${subjectName}.countTot`,
      dataField: "countTot",
    },
    {
      label: `dashboard.${subjectName}.countNew`,
      dataField: "countNew",
    },
  ];
  const singleData = analysisData.singleData[0];
  const dataCardData = {
    ...singleData,
    countTot: subjectCount,
    countNew: subjectCountNew,
  };

  const dataGridColumns = [
    {
      field: "code",
      headerName: "formField.code",
      width: isMB ? 70 : 100,
    },
    {
      field: "nome",
      headerName: "formField.nome",
      width: isMB ? 70 : 100,
    },
    {
      field: "order_imp",
      headerName: `dashboard.${subjectName}.price`,
      renderCell: (params) => getPrice(params.value),
    },
    {
      field: "count",
      headerName: `dashboard.${subjectName}.countOrder`,
      width: isMB ? 70 : 100,
    },
  ];
  const vipRows = [];
  analysisData?.groupData?.forEach(
    (data) => data._id && data._id.length > 0 && vipRows.push(data)
  );
  const dataGridRows = renderRows(vipRows);
  return (
    <FieldSection
      isMB={isMB}
      dataCardObjs={dataCardObjs}
      dataCardData={dataCardData}
      dataGridTitle={`${type === 1 ? "供应商采购" : "会员购买"}排名`}
      dataGridColumns={dataGridColumns}
      dataGridRows={dataGridRows}
    />
  );
}
