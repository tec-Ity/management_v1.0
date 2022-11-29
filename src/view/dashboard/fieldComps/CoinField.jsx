import React, { useEffect } from "react";
import FieldSection from "../FieldSection.jsx";
import getPrice from "../../../utils/price/getPrice";
import renderRows from "../analysisUtils/renderDataGridRows.js";
import { fetchObjs } from "../../../config/module/setting/payment/coin/coinConf";
import { useDispatch, useSelector } from "react-redux";
import {
  getObjects,
  selectObjectsCount,
  selectObjects,
} from "../../../redux/fetchSlice.js";

export default function CoinField({ analysisData, type, isMB }) {
  const dispatch = useDispatch();
  const coinCount = useSelector(selectObjectsCount(fetchObjs.flag));
  const coins = useSelector(selectObjects(fetchObjs.flag));

  useEffect(() => {
    dispatch(getObjects({ fetchObjs }));
  }, []);

  const dataCardObjs = [
    {
      label: `dashboard.coin.countActive`,
      dataField: "countActive",
    },
    {
      label: `dashboard.coin.count`,
      dataField: "count",
    },
  ];
  const dataCardData = {
    ...analysisData.singleData[0],
    count: coinCount,
    countActive: analysisData.groupData?.length,
  };

  const dataGridColumns = [
    { field: "code", headerName: "formField.code" },
    { field: "nome", headerName: "formField.nome" },
    { field: "symbol", headerName: "formField.symbol" },
    { field: "rate", headerName: "formField.rate" },
    { field: "count", headerName: "dashboard.coin.countPay" },
    {
      field: "order_imp",
      headerName: "dashboard.coin.totPay",
      renderCell: (params) => getPrice(params.value),
    },
    // type === 1 && { field: "Supplier", headerName: "formField.Supplier" },
  ];

  // const dataGridRows = renderRows(analysisData.groupData);
  const dataGridRows = analysisData.groupData?.map((coinAna, index) => {
    const coinObj = { ...coinAna, index: index + 1, _id: index };
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      if (coin.symbol === coinAna._id) {
        return {
          ...coinObj,
          code: coin.code,
          nome: coin.nome,
          symbol: coin.symbol,
          rate: coin.rate,
        };
      }
    }
    return coinObj;
  });
  // console.log(dataGridRows);
  return (
    <FieldSection
      isMB={isMB}
      dataCardObjs={dataCardObjs}
      dataCardData={dataCardData}
      dataGridTitle={"货币排名"}
      dataGridColumns={dataGridColumns}
      dataGridRows={dataGridRows}
    />
  );
}
