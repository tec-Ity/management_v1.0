import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import CusDataGrid from "../../component/dataGrid/CusDataGrid";
import DataCardGroup from "./analysisComp/DataCardGroup";

export default function FieldSection({
  isMB,
  size,
  dataCardObjs,
  dataCardData,
  dataGridTitle,
  dataGridColumns,
  dataGridRows,
  showSearch,
  customSearch,
}) {
  const { t } = useTranslation();
  const defaultGridCols = [
    {
      field: "index",
      headerName: t("formField.index"),
      width: 50,
      headerAlign: "center",
    },
  ];

  // let rows = [{ _id: "" }];

  // if (analysisData && dataGridObj) {
  //   const { groupData } = analysisData;
  //   if (dataGridObj?.rows && groupData) rows = dataGridObj.rows(groupData);
  // }
  // console.log(rows);
  return (
    <>
      <Grid
        container
        item
        xs={12}
        columnSpacing={isMB ? 1 : 2}
        rowSpacing={isMB ? 1 : 2}
      >
        <DataCardGroup
          size={size}
          isMB={isMB}
          dataObjs={dataCardObjs}
          analysisData={dataCardData}
        />
      </Grid>
      {dataGridColumns && dataGridRows && (
        <Grid container item xs={12}>
          <Paper sx={{ width: "100%", minHeight: 400 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Typography variant="h5" sx={{ m: { xs: 1, md: 2 } }}>
                {dataGridTitle}
              </Typography>
              {showSearch && (
                <Box
                  sx={{
                    m: 1,
                    ml: { xs: 1, md: 4 },

                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {customSearch ? customSearch : "search"}
                </Box>
              )}
            </Box>
            <CusDataGrid
              count={dataGridRows.length}
              columns={[
                ...defaultGridCols,
                ...dataGridColumns?.map((col) => ({
                  ...col,
                  headerName: t(col.headerName),
                })),
              ]}
              rows={dataGridRows}
            />
          </Paper>
        </Grid>
      )}
      {/* <Grid
        container
        item
        xs={12}
        justifyContent="space-between"
        sx={{ height: 400 }}
        columnGap={isMB ? 1 : 3}
      >
        <Grid
          container
          item
          xs={3}
          flexDirection="column"
          rowGap={isMB ? 1 : 3}
        >
          <Grid sx={{ flex: 1 }}>
            <Card sx={{ width: "100%", height: "100%" }}>
              未付、已付圆饼统计图
            </Card>
          </Grid>
          <Grid sx={{ flex: 1 }}>
            <Card sx={{ width: "100%", height: "100%" }}>成本、利润饼状图</Card>
          </Grid>
        </Grid>
        <Grid sx={{ flex: 1 }}>
          <Card sx={{ width: "100%", height: "100%" }}>趋势折线图</Card>
        </Grid>
      </Grid> */}
    </>
  );
}
