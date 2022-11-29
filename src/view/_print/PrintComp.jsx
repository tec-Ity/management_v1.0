import React, { useEffect } from "react";
import { getLodop } from "../../utils/print/LodopFuncs";

export default function PrintComp({
  startPrint,
  printContent,
  onPrintDone,
  printTitle = "print",
}) {
  const printPage = () => {
    try {
      console.log("start printing");
      let LODOP = getLodop();
      LODOP.PRINT_INIT(printTitle); //打印初始化
      let strStyle = `<style> </style> `;
      //SET_PRINT_PAGESIZE(intOrient,intPageWidth,intPageHeight,strPageName);
      ///http://www.lodop.net/demolist/PrintSample5.html
      LODOP.SET_PRINT_PAGESIZE(3, 800);
      LODOP.SET_PRINT_STYLEA(0, "Horient", 2);
      LODOP.ADD_PRINT_HTM(
        10,
        0,
        "100%",
        450,
        strStyle + document.getElementById("print").innerHTML
      );
      // LODOP.PREVIEW(); //最后一个打印(预览)语句
      LODOP.PRINT();
      onPrintDone();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (printContent && startPrint) printPage();
  }, [printContent]);

  return (
    <div id="print" style={{ display: "none" }}>
      {printContent}
    </div>
  );
}
