import React from "react";
import { useSelector } from "react-redux";
import Epson from "./epson/Epson";

const fiscals = {
  EPSON: Epson,
  none: () => <></>,
};

export default function FiscalPrintComp({
  type,
  instruction,
  payload,
  ...rest
}) {
  const fiscalPrinter =
    useSelector((state) => state.root.settings?.fiscalPrinter) || "none";
  const Fiscal = fiscals[type || fiscalPrinter];
  return <Fiscal instruction={instruction} payload={payload} {...rest} />;
}
