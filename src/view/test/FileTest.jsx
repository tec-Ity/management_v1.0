import React, { useState } from "react";
import moment from "moment";
export default function FileTest() {
  const [content, setContent] = useState("");
  // const [index1, setIndex1] = useState(1);
  // const [index2, setIndex2] = useState(1);
  const printContent = (content, name, path) => {
    const res = window.electron?.fileApi.writeFile(
      name || "sco" + moment().format("MM-DD-YYYY-HH-mm-ss") + ".txt",
      "C:/Users/Utente/Desktop/print/" + (path || "input"),
      content,
      (data) => console.log(222, data)
    );
    console.log(111, res);
  };
  // React.useEffect(() => {
  //   console.log("index1", index1, "-index2", index2);
  // }, [index1, index2]);
  return (
    <div>
      <h1>File test write</h1>
      {/* <button
        onClick={() => {
          setIndex1(2);
          setIndex2(2);
        }}
      >
        test
      </button> */}
      <form
        id="fileForm"
        onSubmit={(e) => {
          e.preventDefault();
          printContent(content, "test.txt");
        }}
      >
        <textarea
          form="fileForm"
          id="fileContentTest"
          name="fileContentTest"
          rows="4"
          cols="50"
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">write</button>
      </form>

      <button
        onClick={() =>
          printContent(
            "printerFiscalReceipt\n" +
              "Printer|1\n" +
              "printRecMessage|1|1|1|1|First additional header type 1 line\n" +
              "printRecMessage|1|1|2|1|Second additional header type 1 line\n" +
              "printRecMessage|1|4|1|1|First additional body type 4 line\n" +
              "printRecItem|1|Product 1 22% VAT|1,04|0,01|1|1\n" +
              "printRecMessage|1|4|1|1|Second additional body type 4 line\n" +
              "printRecItem|1|Product 2 10% VAT|1|0,10|2|1\n" +
              "printRecVoidItem|1|Sale correction dept 1 22% VAT|4|0,01|1|1\n" +
              "printRecItem|1|Product 3 4% VAT|2,5|1,17|3|1\n" +
              "printRecMessage|1|4|1|1|Third additional body type 4 line\n" +
              "printRecItem|1|Sale department 13 VAT exempt|1|216,17|13|1\n" +
              "printRecItemAdjustment|1|Discount on last sale|0|123,45|13|1\n" +
              "printRecItem|1|Sale department 10 VAT excluded|2,10|2|10|1\n" +
              "printRecSubtotalAdjustment|1|Discount on subtotal|1|300,12|0|1\n" +
              "printRecSubtotal|1|0\n" +
              "printRecMessage|1|2|1|1|First trailer type 2 line\n" +
              "printRecMessage|1|2|2|1|Second trailer type 2 line\n" +
              "printRecMessage|1|3|1|1|First additional trailer type 3 line\n" +
              "printRecMessage|1|3|2|1|Second additional trailer type 3 line\n" +
              "printBarCode|1|901|2|66|TWICE|FontA|CODE39|01234567ABCDEF\n" +
              "printRecTotal|1|cash index 3|0,00|0|3|1"
          )
        }
      >
        销售
      </button>
      <button
        onClick={() =>
          printContent(
            "printerNonFiscal\n" +
              "Printer|1\n" +
              "printRecMessage|1|1|1|1|First additional header type 1 line\n" +
              "printRecMessage|1|1|2|1|Second additional header type 1 line\n" +
              "beginNonFiscal|1\n" +
              "printNormal|1|1|Line font 1 printNormal|1|2|\n" +
              "printNormal|1|2|CODE39 barcode standard\n" +
              "printBarCode|1|901|2|66|TWICE|FontA|CODE39|01234567ABCD\n" +
              "printNormal|1|2|\n" +
              "printNormal|1|2|acqua  22% VAT   22,00%    0,01\n" +
              "printNormal|1|3|Line font 3\n" +
              // "printNormal|1|2|\n" +
              // "printNormal|1|2|CODE93 barcode standard\n" +
              // "printBarCode|1|901|2|66|TWICE|FontA|CODE93|01234567ABCDEF\n" +
              // "printNormal|1|2|\n" +
              // "printNormal|1|4|Line font 4\n" +
              // "printNormal|1|2|\n" +
              // "printNormal|1|2|CODE 128 subtype A barcode standard\n" +
              // "printBarCode|1|901|2|100|TWICE|FontA|CODE128|{A01234567ABCDEF\n" +
              // "printNormal|1|2|\n" +
              // "printNormal|1|2|CODE 128 subtype B barcode standard\n" +
              // "printBarCode|1|901|2|100|TWICE|FontA|CODE128|{B01234567ABCDEF\n" +
              // "printNormal|1|2|\n" +
              // "printNormal|1|2|CODE 128 subtype C barcode standard\n" +
              // "printBarCode|1|901|2|66|TWICE|FontA|CODE128|{C0123456789\n" +
              // "printNormal|1|2|\n" +
              "printNormal|1|2|QR code type 2 standard\n" +
              "printQRCode|1|1||8|ALPHANUMERIC|LOW|QRCODE2|123456789\n" +
              "displayText|4|Customer Display Printed Non Fisc Doc\n" +
              "endNonFiscal|1"
          )
        }
      >
        管理
      </button>
      <button
        onClick={() =>
          printContent(
            "printerCommand\n" + "Printer|1\n" + "displayText|1|prod1 99,00"
          )
        }
      >
        显示
      </button>
      <button
        onClick={() =>
          printContent("printerCommand\n" + "Printer|1\n" + "openDrawer|1")
        }
      >
        钱箱
      </button>
    </div>
  );
}
