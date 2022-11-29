import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { t } from "i18next";
import CusButtonGroup from "../../component/buttonGroup/CusButtonGroup.jsx";
import CusForm from "../../component/form/CusForm.jsx";
import CusDialog from "../../component/modal/CusDialog.jsx";
import invoiceFormInputs from "../../config/module/invoice/invoiceFormInputs.js";
import generateInvoice from "./generateInvoice.js";
import { useSelector } from "react-redux";

export default function InvoiceModal({ open, onClose, order }) {
  const TYPE_BUTTONS = [
    { label: t("formField.company"), value: "company" },
    { label: t("formField.person"), value: "person" },
  ];

  // const shopInfo = useSelector((state) => state.auth.userInfo.Shop);
  const shopId = useSelector((state) => state.auth?.userInfo?.Shop?._id);
  const [type, setType] = useState(TYPE_BUTTONS[0].value);
  const handleSubmit = async (formValue) => {
    console.log(formValue);
    generateInvoice(shopId, formValue, order);
  };
  const handleChangeType = (value) => {
    setType(value);
  };
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      dividers
      title="填写发票信息"
      content={
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ mr: 3 }}>
              发票类型：
            </Typography>
            <CusButtonGroup
              buttonObjs={TYPE_BUTTONS}
              handleChange={handleChangeType}
            />
          </Box>
          <CusForm
            showFormGroup
            handleSubmit={handleSubmit}
            // handleCancel={onClose}
            // submitStatus={putStatus}
            formInputs={invoiceFormInputs}
            defaultValue={{
              type,
              receiverCode: "0000000",
              country: "IT",
              province: "MI",
            }}
            clearAfterSubmit={false}
            formType="POSt"
          />
        </Box>
      }
    />
  );
}
