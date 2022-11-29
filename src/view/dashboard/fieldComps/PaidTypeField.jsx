import React, { useEffect } from "react";
import FieldSection from "../FieldSection.jsx";
import getPrice from "../../../utils/price/getPrice";
import renderRows from "../analysisUtils/renderDataGridRows.js";
import { fetchObjs } from "../../../config/module/setting/payment/type/paidTypeConf";
import { useDispatch, useSelector } from "react-redux";
import {
  getObjects,
  selectObjects,
  selectObjectsCount,
} from "../../../redux/fetchSlice.js";

export default function PaidTypeField({ analysisData, type, isMB }) {
  const dispatch = useDispatch();
  const paidTypeCount = useSelector(selectObjectsCount(fetchObjs.flag));
  const paidTypes = useSelector(selectObjects(fetchObjs.flag));
  console.log(paidTypes);
  useEffect(() => {
    dispatch(getObjects({ fetchObjs }));
  }, []);

  const dataCardObjs = [
    {
      label: `dashboard.paidType.euro`,
      dataField: "euro",
    },
    {
      label: `dashboard.paidType.rmb`,
      dataField: "rmb",
    },
  ];
  const { coinData } = analysisData;
  const getCoin = (symbol) =>
    getPrice(
      coinData?.find((data) => data._id === symbol)?.price_coin,
      2,
      symbol
    );
  const dataCardData = {
    // ...analysisData.singleData[0],
    // count: paidTypeCount,
    // countActive: analysisData.groupData?.length,
    euro: getCoin("€"),
    rmb: getCoin("￥"),
  };

  const dataGridColumns = [
    { field: "code", headerName: "formField.code", width: isMB ? 70 : 80 },
    { field: "nome", headerName: "formField.nome", width: isMB ? 70 : 100 },
    {
      field: "price_coin",
      headerName: "dashboard.paidType.price_coin",
      renderCell: (params) => getPrice(params.value, 2, params?.row?.symbol),
      width: isMB ? 70 : 100,
    },
    { field: "coin", headerName: "formField.Coin", width: isMB ? 70 : 100 },
    { field: "rate", headerName: "formField.rate", width: 70 },
    {
      field: "order_imp",
      headerName: "dashboard.paidType.exchange",
      renderCell: (params) => getPrice(params.value),
      width: isMB ? 70 : 100,
    },
    {
      field: "count",
      headerName: "dashboard.paidType.countPay",
      width: isMB ? 70 : 100,
    },
    {
      field: "is_cash",
      headerName: "formField.is_cash",
      renderCell: (params) => (params.value ? "是" : "否"),
      width: 50,
    },
    // type === 1 && { field: "Supplier", headerName: "formField.Supplier" },
  ];
  // const dataGridRows = renderRows(analysisData.groupData);
  const dataGridRows = renderRows(analysisData.groupData)?.map((anaObj) => {
    for (let i = 0; i < paidTypes.length; i++) {
      const paidType = paidTypes[i];
      if (anaObj._id === paidType._id) {
        const { Coin } = paidType;
        return {
          ...anaObj,
          is_cash: paidType.is_cash,
          coin: `${Coin?.nome} (${Coin?.symbol})`,
          rate: Coin.rate,
          symbol: Coin?.symbol,
        };
      }
    }
    return anaObj;
  });
  return (
    <FieldSection
      isMB={isMB}
      dataCardObjs={dataCardObjs}
      dataCardData={dataCardData}
      dataGridTitle={"支付方式排名"}
      dataGridColumns={dataGridColumns}
      dataGridRows={dataGridRows}
    />
  );
}
