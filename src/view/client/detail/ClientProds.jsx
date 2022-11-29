import React from "react";
import { t } from "i18next";
import Dashboard from "../../dashboard/DashBoard.jsx";
import { Box } from "@mui/material";
export default function ClientProds({ _id }) {
  return (
    <>
      <Dashboard
        type={-1}
        defaultField="orderProd"
        defaultMatchObj={{ Client: _id }}
        showTitle={false}
        showTypeButtons={false}
        showFieldButtons={false}
        customDateButtons={[
          { label: t("date.all"), value: -1 },
          { label: t("date.last7"), value: 7 },
          { label: t("date.last30"), value: 30 },
          { label: t("date.last90"), value: 90 },
        ]}
        size="small"
      />
      <Box sx={{ height: 80 }} />
    </>
  );
}
