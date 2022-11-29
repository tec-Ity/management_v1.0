import moment from "moment";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import writeFile from "../../../utils/file/writeFile";
import getPrice from "../../../utils/price/getPrice";
import removeCh from "../../../utils/string/removeCh";

const writeContent = (content, path) =>
  writeFile(
    content,
    "sco" + moment().format("MM-DD-YYYY-HH-mm-ss") + ".txt",
    path
  );

const display = (payload, path) => {
  const content =
    "printerCommand\n" + "Printer|1\n" + `displayText|1|${payload}`;
  if (payload) {
    return writeContent(content, path);
  }
};

const fiscalOrder = (order, path) => {
  try {
    if (!order || !order._id || !order.OrderProds?.length > 0)
      throw new Error("订单为空");
    const { OrderProds, order_imp, Paidtype } = order;
    let content = "printerFiscalReceipt\n" + "Printer|1\n";
    // "printRecMessage|1|1|1|1|First additional header type 1 line\n" +
    // "printRecMessage|1|1|2|1|Second additional header type 1 line\n" +
    // "printRecMessage|1|4|1|1|First additional body type 4 line\n";
    OrderProds?.forEach((op, index) => {
      const { nome, code, price, quantity, Prod, price_regular } = op;
      const { iva } = Prod;
      const nDepIva = {
        22: 1,
        10: 2,
        4: 3,
      }[iva];
      content += `printRecItem|1|${removeCh(nome)?.slice(0, 20)}|\
      ${parseFloat(quantity)}|\
      ${parseFloat(price)}|\
      ${nDepIva}|1\n`;
      if (price < price_regular)
        content += `printRecItemAdjustment|1|Scont. -${getPrice(
          1 - price / price_regular,
          2,
          ""
        )}%|0|${parseFloat(price_regular - price)?.toFixed(2)}|${nDepIva}|1\n`;
      // * ,
      // content += `printRecItem|1|${nome?.slice(0, 20)}|\
      // ${getPrice(parseFloat(quantity) / 100, 2, "")}|\
      // ${getPrice(parseFloat(price) / 100, 2, "")}|\
      // ${nDepIva}|1\n`;
    });

    content += "printRecSubtotal|1|0\n";
    content += `printRecTotal|1|${Paidtype?.code}}|\
    ${parseFloat(order_imp)}|0|1|1`;
    // content += `printRecTotal|1|${Paidtype?.code}}|\
    // ${getPrice(order_imp, 2, "")}|0|1|1`;
    return writeContent(content, path);
  } catch (e) {
    console.log(e);
  }
};

const nonFiscalOrder = (order, path) => {
  try {
    if (!order || !order._id || !order.OrderProds?.length > 0)
      throw new Error("订单为空");
    const { OrderProds, order_imp, Paidtype } = order;
    let content =
      "printerNonFiscal\n" +
      "Printer|1\n" +
      "beginNonFiscal|1\n" +
      "printNormal|1|2|DESCRIZIONE\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tIVA\t\t\t\t\t\tPrezzo\n";
    //! test for fiscal version nonfiscal
    // let content =
    //   "printerFiscalReceipt\n" + "Printer|1\n" + "beginFiscalReceipt|1\n";

    // content += "printRecTotal|1|cash|5|1|1";
    let totIva = 0;
    OrderProds.forEach((op) => {
      const { nome, code, price, quantity, Prod } = op;
      const { iva } = Prod;
      if (iva) totIva += price * quantity * (1 - 1 / (1 + iva / 100));
      if (quantity > 1) {
        content += `printNormal|1|1|\t\t\t\t\t\t\t${quantity}\tx\t${getPrice(
          price,
          2,
          ""
        )}\n`;
      }
      content += `printNormal|1|1|${(
        nome + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
      )?.slice(0, 20)}\t\t\t\t\t\t${getPrice(iva, 2, "")}%\t\t\t\t\t\t\t\t${
        price * quantity < 100 ? "\t" : ""
      }${price * quantity < 10 ? "\t" : ""}${getPrice(
        price * quantity,
        2,
        ""
      )}\n`;
    });
    content += `printNormal|1|1|\t\n`;
    content += `printNormal|1|3|TOTALE COMPLESSIVO\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${
      order_imp < 100 ? "\t" : ""
    }${order_imp < 10 ? "\t" : ""}\
    ${getPrice(order_imp, 2, "")}\n`;
    content += `printNormal|1|3|di cui IVA\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${
      totIva < 100 ? "\t" : ""
    }${totIva < 10 ? "\t" : ""}\
    ${getPrice(totIva, 2, "")}\n`;
    content += "printNormal|1|1|\t\n";
    content += `printNormal|1|1|Pagamento contante\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${
      order_imp < 100 ? "\t" : ""
    }${order_imp < 10 ? "\t" : ""}\
    ${getPrice(order_imp, 2, "")}\n`;
    content += `printNormal|1|1|Importo pagato\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${
      order_imp < 100 ? "\t" : ""
    }${order_imp < 10 ? "\t" : ""}\
    ${getPrice(order_imp, 2, "")}\n`;
    content += "openDrawer|1\n";
    content += "endNonFiscal|1";
    return writeContent(content, path);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const zReport = (path) => {
  const content = "printerFiscalReport\n" + "Printer|1\n" + "printZReport|1\n";

  return writeContent(content, path);
};

const openDrawer = (path) => {
  const content = "printerCommand\n" + "Printer|1\n" + "openDrawer|1";
  return writeContent(content, path);
};

export default function Epson({ instruction, payload, onFinish }) {
  console.log(1111111, instruction, payload);
  const [completed, setCompleted] = useState(false);
  const inputPath = useSelector((state) => state.root.settings.inputPath);
  const stringifyPayload =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  useEffect(() => {
    const startWrite = () => {
      switch (instruction) {
        case "display":
          return display(payload, inputPath);
        // break;
        case "fiscal":
          return fiscalOrder(payload, inputPath);
        // break;
        case "nonFiscal":
          return nonFiscalOrder(payload, inputPath);
        case "zReport":
          return zReport(inputPath);
        case "drawer":
          return openDrawer(inputPath);
        default:
          return false;
      }
      // setCompleted(true);
    };

    // if (!completed && instruction) startWrite();
    const func = async () => {
      if (instruction) {
        const res = await startWrite();
        if (res === "done") onFinish();
      }
    };

    func();
  }, [instruction, stringifyPayload]);

  return <></>;
}
