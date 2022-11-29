import { Button } from "@mui/material";
import React from "react";
import CusClientSearch from "../filter/CusClientSearch.jsx";
import CusModal from "./CusModal.jsx";

export default function ClientModal({
  open,
  onClose,
  handleSelectClient,
  ...rest
}) {
  return (
    <CusModal open={open} onClose={onClose} size="md">
      <CusClientSearch
        {...rest}
        onClose={onClose}
        handleSelectClient={handleSelectClient}
      />
    </CusModal>
  );
}
