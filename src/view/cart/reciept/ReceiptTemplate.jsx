import React, { useEffect, useRef } from "react";
import moment from "moment";
import getPrice from "../../../utils/price/getPrice";
// import JsBarcode from "jsbarcode";
export default function ReceiptTemplate({ order }) {
  // const [url, setUrl] = React.useState("");

  // useEffect(() => {
  //   //create new element
  //   let canvas = document.createElement("canvas");
  //   //generate barcode
  //   JsBarcode(canvas, "888888", {
  //     displayValue: true,
  //   });
  //   // convert to image url
  //   setUrl(canvas.toDataURL("image/png"));
  // }, [order]);
  // console.log(11111111, order);
  return order ? (
    <div
      style={{
        width: "80mm",
        // border: "1px solid",
        fontSize: "12px",
        boxSizing: "border-box",
        paddingBottom: "5mm",
        paddingTop: "5mm",
      }}
    >
      {/* <img src={url} alt="barcode" /> */}
      {/* <svg id="barcode" /> */}
      <div style={{ width: "70mm", margin: "auto" }}>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
            paddingBottom: "10px",
          }}
        >
          ——{order.Shop?.nome}——
        </div>
        <div style={{ width: "100%" }}>
          <div>
            <span>时&nbsp;&nbsp;&nbsp;&nbsp;间：</span>
            <span>
              {moment(
                order.is_virtual ? order?.show_crt : order?.at_crt
              ).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </div>
          <div>
            <span>收银员：</span>
            <span>前台</span>
          </div>
          <div>
            <span>单&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
            <span>{order.code}</span>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid",
            margin: "10px 0",
          }}
        >
          <span
            style={{
              width: "23%",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            数量
          </span>
          <span
            style={{
              width: "23%",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            单价
          </span>
          <span
            style={{
              width: "23%",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            折扣
          </span>
          <span
            style={{
              width: "23%",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            金额
          </span>
        </div>
        {order?.OrderProds?.map((op, index) => (
          <div key={index} style={{ width: "100%", marginBottom: "1px" }}>
            <div
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {op.Prod?.nome}
            </div>
            <div
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {op.Prod?.nomeTR}
            </div>
            <div style={{ width: "100%" }}>
              <span
                style={{
                  width: "23%",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {op.quantity}/{op.unit}
              </span>
              <span
                style={{
                  width: "23%",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {getPrice(op.price_sale)}
              </span>
              <span
                style={{
                  width: "23%",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {String(
                  ((1 - op.price / op.price_sale) * 100).toFixed(2)
                ).replace(".", ",")}
                %
              </span>
              <span
                style={{
                  width: "23%",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {getPrice(op.quantity * op.price)}
              </span>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            width: "100%",
            borderTop: "1px solid",
          }}
        >
          <div style={{ width: "100%" }}>
            <span style={{ width: "50%", display: "inline-block" }}>
              <span>总数：</span>
              <span>{order.goods_quantity}</span>
            </span>
            <span style={{ width: "50%", display: "inline-block" }}>
              <span>总额：</span>
              <span>{getPrice(order.order_imp)}</span>
            </span>
          </div>
          <div style={{ width: "100%" }}>
            <span style={{ width: "50%", display: "inline-block" }}>
              <span>折扣：</span>
              <span>
                {String(
                  ((1 - order.order_imp / order.order_sale) * 100).toFixed(2)
                ).replace(".", ",")}
                %
              </span>
            </span>
          </div>
        </div>
        {order.rate !== 1 && (
          <div style={{ width: "100%" }}>
            <span>折合：</span>
            {/* <span>{}</span> */}
            <span>{`${getPrice(order.order_imp)} * ${order.rate} = ${
              order.symbol + parseFloat(order.price_coin)?.toFixed(2)
            }`}</span>
          </div>
        )}
        <div
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
            paddingTop: "10px",
          }}
        >
          ——欢迎下次光临——
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
