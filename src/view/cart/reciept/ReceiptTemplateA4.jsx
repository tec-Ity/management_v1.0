import moment from "moment";
import React from "react";
import getPrice from "../../../utils/price/getPrice";

export default function ReceiptTemplateA4({ order }) {
  const A4 = {
    width: "210mm",
    height: "297mm",
  };
  return (
    order && (
      <div
        style={{
          width: A4.width,
          // height: infoObj.height,
          boxSizing: "border-box",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div style={{ width: "90%", margin: "auto" }}>
          <span style={{ position: "absolute", left: "5%", top: "5%" }}>
            {moment().format("DD/MM/yyyy")}
          </span>
          <table
            style={{
              // border: "2px solid",
              width: "100%",
              marginTop: 40,
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr>
                <td colSpan={6}>
                  <h2
                    style={{
                      textAlign: "center",
                      fontSize: 40,
                      marginBottom: 0,
                    }}
                  >
                    {order.Shop?.nome}
                  </h2>
                </td>
              </tr>
              <tr>
                <td colSpan={6}>
                  <h3 style={{ textAlign: "center", marginBottom: 0 }}>
                    PREVENTIVO
                  </h3>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={6}
                  style={{ borderTop: "1px solid", height: 0 }}
                ></td>
              </tr>
              <tr style={{ textAlign: "start" }}>
                <td colSpan={2}>地址：{order.Shop?.addr}</td>
                <td colSpan={2}>客户：{order.Client?.nome || "无"}</td>
                <td colSpan={2}>No.：{order.code}</td>
              </tr>
              <tr style={{ textAlign: "start" }}>
                <td colSpan={2}>区号：{order.Shop?.zip}</td>
                <td colSpan={2}>电话：{order.Client?.phone}</td>
                <td colSpan={2}>
                  日期：{moment(order.at_crt).format("YYYY-MM-DD")}
                </td>
              </tr>
              <tr style={{ textAlign: "start" }}>
                <td colSpan={2}>电话：{order.Shop?.tel}</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th style={{ border: "2px solid" }}>
                  <h2>Codice</h2>
                </th>
                <th style={{ border: "2px solid" }} colSpan={2}>
                  <h2>Desc</h2>
                </th>
                <th style={{ border: "2px solid" }}>
                  <h2>QNT</h2>
                </th>
                <th style={{ border: "2px solid" }}>
                  <h2>Prezzo</h2>
                </th>
                <th style={{ border: "2px solid" }}>
                  <h2>Total</h2>
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: 20, textAlign: "center" }}>
              {order.OrderProds?.map((op, index) => (
                <tr key={index}>
                  <td>{op.Prod?.code}</td>
                  <td colSpan={2}>{op.Prod?.nome}</td>
                  <td>{op.quantity}</td>
                  <td>{getPrice(op.price)}</td>
                  <td>{getPrice(op.price * op.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot
              style={{ fontSize: 24, fontWeight: 700, border: "2px solid" }}
            >
              <tr>
                <td style={{ border: "2px solid" }}>
                  T.Art: {order.OrderProds?.length}
                </td>
                <td colSpan={2} style={{ border: "2px solid" }}>
                  Tot: {order.goods_quantity} pz
                </td>
                <td></td>
                <td colSpan={2} style={{ border: "2px solid" }}>
                  IMP: {getPrice(order.order_imp)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* <div style={{ height: "5mm" }}></div> */}
      </div>
    )
  );
}
