import React from "react";
import FieldSection from "../FieldSection.jsx";
import getPrice from "../../../utils/price/getPrice";
import renderRows from "../analysisUtils/renderDataGridRows.js";
export default function GeneralField({ analysisData, type, isMB }) {
  const dataCardObjs = [
    {
      label: `dashboard.general.${type === 1 ? "purOrder" : "order"}Price`,
      dataField: "order_imp",
      renderData: (data) => getPrice(data),
    },
    {
      label: `dashboard.general.${type === 1 ? "purOrder" : "order"}Count`,
      dataField: "count",
    },
    {
      label: `dashboard.general.${type === 1 ? "purOrder" : "order"}Products`,
      dataField: "goods_quantity",
    },
  ];
  const dataCardData = analysisData.singleData
    ? analysisData.singleData[0]
    : {};

  const dataGridColumns = [
    { field: "code", headerName: "formField.code", width: 150 },
    { field: "nome", headerName: "formField.nome", width: 200 },
    // { field: "nomeTR", headerName: "formField.nomeTR", width: 200 },
    {
      field: "prod_sale",
      headerName: "formField.price_sale",
      renderCell: (params) => getPrice(params.value),
    },
    { field: "prod_quantity", headerName: "dashboard.product.prodQuantity" },
    // type === 1 && { field: "Supplier", headerName: "formField.Supplier" },
  ];
  const dataGridRows = renderRows(analysisData.groupData);
  return (
    <FieldSection
      isMB={isMB}
      dataCardObjs={dataCardObjs}
      dataCardData={dataCardData}
      // dataGridTitle={`商品${type === 1 ? "采购" : "销售"}总排名`}
      // dataGridColumns={dataGridColumns}
      // dataGridRows={dataGridRows}
    />
  );
}
