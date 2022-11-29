import React, { useEffect } from "react";
// const electron = window.require("electron");
// const fs = electron.remote.require("fs");
// const ipcRenderer = electron.ipcRenderer;
export default function ElectronPrintComp({
  startPrint,
  printContent,
  onPrintDone,
}) {
  const deviceName = localStorage.getItem("deviceName");
  const [printerList, setPrinterList] = React.useState([]);
  // console.log(printerList);
  //get printers
  useEffect(() => {
    window.electron?.printApi.getPrinterList((list) => setPrinterList(list));
  }, []);

  //print function
  useEffect(() => {
    if (printContent && startPrint) {
      console.log("start print");
      window.electron?.printApi.startPrint(
        deviceName || printerList[0]?.name,
        document.getElementById("electronPrintContent").innerHTML,
        (success) => {
          console.log("printDone", success);
          onPrintDone();
        }
      );
    }
  }, [startPrint]);

  return (
    <div
      id="electronPrintContent"
      style={{ position: "fixed", display: "none" }}
    >
      {printContent}
    </div>
  );
}
