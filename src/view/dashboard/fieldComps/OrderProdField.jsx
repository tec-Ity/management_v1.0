import React, { useEffect, useState } from "react";
import FieldSection from "../FieldSection.jsx";
import getPrice from "../../../utils/price/getPrice";
import renderRows from "../analysisUtils/renderDataGridRows.js";
import { useSelector } from "react-redux";
import DropSearch from "../../../component/search/DropSearch.jsx";
import { fetchObjs } from "../../../config/module/prod/prodConf.js";
import { Box, Button, Card, Typography } from "@mui/material";
import SearchInput from "../../../component/search/SearchInput.jsx";
export default function OrderProdField({
  analysisData,
  type,
  isMB,
  busType,
  setMatchObj,
  size,
}) {
  const dataCardData = analysisData?.singleData && analysisData.singleData[0];

  const DNS = useSelector((state) => state.auth.DNS);
  // const [selectedProd, setSelectedProd] = React.useState(null);
  const [dataGridRows, setDataGridRows] = useState(analysisData.groupData);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    console.log(11111, searchVal);
    if (searchVal) {
      let filteredRows = [];
      analysisData?.groupData?.forEach((item) => {
        if (!item._id) return;
        const { code, nome } = item._id[0] || {};
        // console.log(code, nome);
        if (
          nome?.toUpperCase()?.includes(searchVal.toUpperCase()) ||
          code?.toUpperCase()?.includes(searchVal.toUpperCase())
        )
          filteredRows.push(item);
        // console.log(2222222, code, nome);
      });
      setDataGridRows(filteredRows);
    } else setDataGridRows(analysisData.groupData);
  }, [analysisData.groupData, searchVal]);

  const dataCardObjs = [
    {
      label: `dashboard.product.${type === 1 ? "purchase" : "sale"}QuantityTot`,
      dataField: "prod_quantity",
    },
    {
      label: `dashboard.product.${type === 1 ? "purchase" : "sale"}PriceTot`,
      dataField: "prod_price",
      renderData: (data) => getPrice(data),
    },
  ];

  const dataGridColumns = [
    {
      field: "img_xs",
      headerName: "formField.image",
      width: 70,
      renderCell: (params) => {
        // console.log(params);
        return (
          <img
            src={params?.value ? DNS + params?.value : undefined}
            alt=""
            style={{
              height: 45,
              width: 50,
              objectFit: "scale-down",
              cursor: "zoom-in",
            }}
          />
        );
      },
    },
    { field: "code", headerName: "formField.code", width: isMB ? 70 : 150 },
    {
      field: "nome",
      headerName: "formField.nome",
      minWidth: isMB ? 80 : 250,
      renderCell: (params) => (
        <Typography title={params.value} variant="body2">
          {params?.value}
        </Typography>
      ),
    },
    // { field: "nomeTR", headerName: "formField.nomeTR", width: 200 },
    {
      field: "prod_quantity",
      headerName: `dashboard.product.${
        type === 1 ? "purchase" : "sale"
      }Quantity`,
      width: isMB ? 70 : 100,
    },
    {
      field: "prod_price",
      headerName: `dashboard.product.${type === 1 ? "purchase" : "sale"}Price`,
      renderCell: (params) => getPrice(params.value),
    },
    // type === 1 && { field: "Supplier", headerName: "formField.Supplier" },
  ];
  // console.log(analysisData.groupData);
  // const dataGridRows = renderRows(analysisData.groupData);

  return (
    <FieldSection
      size={size}
      isMB={isMB}
      dataCardObjs={dataCardObjs}
      dataCardData={dataCardData}
      dataGridTitle={`商品${type === 1 ? "采购" : "销售"}总排名`}
      dataGridColumns={dataGridColumns}
      dataGridRows={renderRows(dataGridRows)}
      showSearch
      customSearch={
        <Box sx={{ width: { xs: 300, md: 500 } }}>
          <SearchInput
            realTime
            handleChange={(val) => setSearchVal(val)}
            style={{ borderColor: `${busType}.main` }}
          />
        </Box>
      }
    />
  );
}

//custom search
/* <Box sx={{ width: 400 }}>
            <DropSearch
              fetchObjs={fetchObjs}
              onSelect={(prod) => {
                if (prod) {
                  setMatchObj("Prod", prod._id);
                  setSelectedProd(prod);
                }
              }}
              inputStyle={{
                borderColor: `${busType}.main`,
              }}
            />
          </Box>
          {selectedProd && (
            <Box sx={{ ml: 2, display: "flex" }}>
              <Box sx={{ width: 100 }}>
                <Typography>已选商品：</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setSelectedProd(null)}
                >
                  取消
                </Button>
              </Box>
              <Card sx={{ p: 0.5 }} elevation={5}>
                <Typography>{selectedProd.nome}</Typography>
                <Typography>{selectedProd.code}</Typography>
              </Card>
            </Box>
         )} */
