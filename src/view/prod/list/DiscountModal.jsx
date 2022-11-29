import { Box } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { useState } from "react";
import DiscountComp from "../../../component/discount/DiscountComp";
import CusDialog from "../../../component/modal/CusDialog";

export default function DiscountModal({ open, onClose }) {
  const [discount, setDiscount] = useState(1);
  console.log(discount);
  const handleChangeDiscount = async () => {
    const finalDiscount = 1 - discount;
  };
  return (
    <CusDialog
      title="分类折扣"
      open={open}
      onClose={onClose}
      size="sm"
      divider
      content={
        <Box>
          <DiscountComp
            defaultPrice={1}
            value={discount}
            onChange={(v) => setDiscount(v)}
          />
        </Box>
      }
      actions={[
        {
          label: t("general.confirm"),
          color: "primary",
          variant: "contained",
          onClick: () => {},
        },
        {
          label: t("general.cancel"),
          color: "error",
          variant: "outlined",
          onClick: onClose,
        },
      ]}
    />
  );
}
