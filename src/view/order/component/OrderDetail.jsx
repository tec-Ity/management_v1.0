import React, { useState } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
import moment from "moment";
import CusH6 from "../../../component/typography/CusH6";
import getPrice from "../../../utils/price/getPrice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ConfirmDeleteDialog from "../../../component/modal/ConfirmDeleteDialog";
// ! DEMO
import { fetchOrderPut } from "../reducer/orderSlice";

export default function OrderDetail({
  obj,
  onDelete,
  onReorder,
  fullInfo,
  onPrint,
  busType,
  onPutOrderPaidStatus,
  onPutOrderPass,
  onInvoice,
  onPdf,
  // isPaid,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const type = obj?.type_Order;
  const subject = type === 1 ? obj?.Supplier : obj?.Client;
  const BusCusH6 = (props) => <CusH6 {...props} type={props.type || busType} />;
  const [isPaid, setIsPaid] = useState(obj?.isPaid);
  const [isPass, setIsPass] = useState(obj?.is_pass);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const able_MBsell = useSelector((state) => state.auth.userInfo?.able_MBsell);
  const showControlBtns = !(isMB && !able_MBsell);
  const { is_virtual, show_crt } = obj || {};
  const { nome, rels } = obj?.Step || {};
  // const { Step: putStepId, btn_color, btn_val } = {};
  const {
    Step: putStepId,
    btn_color,
    btn_val,
  } = rels && rels[0] ? rels[0] : {};
  return (
    <>
      <Grid container rowSpacing={1}>
        {/* control */}
        {fullInfo && (
          <Grid container item xs={12} rowSpacing={1}>
            {showControlBtns && (
              <>
                <Grid item container xs={6} justifyContent="center">
                  <Button
                    color={busType}
                    variant="contained"
                    sx={{ fontWeight: 700, minWidth: 125 }}
                    onClick={onPrint}
                  >
                    小票打印
                  </Button>
                </Grid>
                <Grid item container xs={6} justifyContent="center">
                  <Button
                    color={busType}
                    variant="contained"
                    sx={{ fontWeight: 700, minWidth: 125 }}
                    onClick={() => onInvoice(obj)}
                  >
                    开发票
                  </Button>
                </Grid>
                <Grid item container xs={6} justifyContent="center">
                  <Button
                    color={busType}
                    variant="contained"
                    sx={{ fontWeight: 700, minWidth: 125 }}
                    onClick={onPdf}
                  >
                    保存PDF
                  </Button>
                </Grid>
              </>
            )}
            <Grid item container xs={6} justifyContent="center">
              <Button
                variant="outlined"
                color="error"
                sx={{ fontWeight: 700, minWidth: 125 }}
                onClick={() => setShowConfirmDelete(true)}
              >
                删除订单
              </Button>
            </Grid>
            {showControlBtns && (
              <>
                {onReorder && (
                  <>
                    <Grid item container xs={6} justifyContent="center">
                      <Button
                        color={busType + "Mid"}
                        variant="outlined"
                        sx={{ fontWeight: 700, minWidth: 125 }}
                        onClick={() => onReorder(true)}
                      >
                        修改订单
                      </Button>
                    </Grid>
                    <Grid item container xs={6} justifyContent="center">
                      <Button
                        color={busType}
                        variant="outlined"
                        sx={{ fontWeight: 700, minWidth: 125 }}
                        onClick={() => onReorder()}
                      >
                        再订一次
                      </Button>
                    </Grid>
                  </>
                )}
              </>
            )}
            {btn_val && (
              <Grid item container xs={6} justifyContent="center">
                <Button
                  // color={btn_color}
                  variant="outlined"
                  sx={{ fontWeight: 700, minWidth: 125, color: btn_color }}
                  onClick={() => {
                    dispatch(
                      fetchOrderPut({ orderId: obj._id, stepId: putStepId })
                    );
                  }}
                >
                  {btn_val}
                </Button>
              </Grid>
            )}
            <Grid item container xs={6} justifyContent="center">
              {isPaid ?? obj.isPaid ? (
                <Button
                  color="error"
                  variant="outlined"
                  sx={{ fontWeight: 700, minWidth: 125 }}
                  onClick={() => {
                    setIsPaid(false);
                    onPutOrderPaidStatus(obj._id, false);
                  }}
                >
                  标记未付
                </Button>
              ) : (
                <Button
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 700, minWidth: 125 }}
                  onClick={() => {
                    setIsPaid(true);
                    onPutOrderPaidStatus(obj._id, true);
                  }}
                >
                  标记已付
                </Button>
              )}
            </Grid>
            <Grid
              item
              container
              xs={6}
              justifyContent="center"
              alignItems="center"
            >
              {isPass ? (
                <Typography>已通过</Typography>
              ) : (
                <Button
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 700, minWidth: 125 }}
                  onClick={() => {
                    setIsPass(true);
                    onPutOrderPass(obj._id);
                  }}
                >
                  通过审核
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ backgroundColor: `${busType}Mid.main` }} />
            </Grid>
          </Grid>
        )}
        {/* code price */}
        <Grid container item xs={12} justifyContent="space-between">
          <BusCusH6>{obj.code}</BusCusH6>
          <BusCusH6>{getPrice(obj.order_imp)}</BusCusH6>
        </Grid>
        {/* date */}
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          sx={{ color: "custom.primary" }}
        >
          <Typography variant="body2">
            {moment(is_virtual ? show_crt : obj.at_crt).format(
              "MM月DD日YYYY年  HH:mm"
            )}
            {/* {moment(is_virtual ? show_crt : obj.at_crt).format(
              "Do MMM YYYY HH:mm"
            )} */}
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {/* {subject?.nome} */}
            {/* 折合 */}
            {obj.order_imp !== obj.price_coin &&
              getPrice(obj.price_coin, 2, obj.symbol)}
          </Typography>
        </Grid>
        {/* detail */}
        <Grid
          container
          item
          xs={12}
          sx={{
            pt: 1,
            "&>div": {
              display: "flex",
              justifyContent: "space-between",
            },
          }}
          columnSpacing={2}
          rowSpacing={0.5}
        >
          <Grid item xs={6}>
            <Typography>数量</Typography>
            <Typography>{obj.goods_quantity}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>原价</Typography>
            <Typography>{getPrice(obj.order_regular)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>付款方式</Typography>
            <Typography>
              {obj.Paidtype?.code || obj.paidTypeObj?.code}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>税率</Typography>
            <Typography>{obj.is_tax ? "22%" : "-"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>汇率</Typography>
            <Typography>
              1:{obj.rate}&nbsp;{obj.symbol}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>税额</Typography>
            <Typography>
              {obj.is_tax ? getPrice(obj.goods_price * 0.22) : "-"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>重量</Typography>
            <Typography>{obj.goods_weight || "-"} KG</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>付款状态</Typography>
            {isPaid ? (
              <Typography color="success"> 已付 </Typography>
            ) : (
              <Typography colro="error"> 未付 </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography>{type === 1 ? "供应商" : "客户"}</Typography>
            <Typography>{subject?.nome || "-"}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ backgroundColor: `${busType}Mid.main` }} />
        </Grid>

        <Grid
          container
          item
          xs={12}
          sx={{
            borderBottom: "1px solid",
            borderColor: `${busType}Mid.main`,
          }}
        >
          <Grid item xs={1.5}>
            <Typography textAlign="center">产品</Typography>
          </Grid>
          <Grid item xs={type === 1 ? 2.5 : 4.5}>
            <Typography textAlign="center">编号/名称</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography textAlign="center">数量</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography textAlign="center">
              {type === 1 ? "进价" : "卖价"}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography textAlign="center">总价</Typography>
          </Grid>
          {type === 1 && (
            <Grid item xs={2}>
              <Typography textAlign="center">卖价</Typography>
            </Grid>
          )}
        </Grid>

        {obj.OrderProds?.map((op) => (
          <ProdRow
            key={op._id}
            op={op}
            fullInfo={fullInfo}
            type={type}
            isMB={isMB}
          />
        ))}
      </Grid>
      <ConfirmDeleteDialog
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        handleDelete={() => onDelete(obj._id)}
      />
    </>
  );
}

const ProdRow = ({ op, fullInfo, type, divider = true, isMB }) => {
  const DNS = useSelector((state) => state.auth.DNS);
  const defaultPrice = type === 1 ? op?.price_cost : op?.price_regular;
  const isDiscount = op.price !== defaultPrice;
  // console.log(op, type, defaultPrice);

  return (
    <Grid
      container
      item
      xs={12}
      key={op._id}
      sx={{
        fontSize: 14,
        "&>div": { display: "flex", alignItems: "center" },
      }}
    >
      {/* image */}
      <Grid item xs={1.5}>
        <img
          src={op.Prod?.img_xs ? DNS + op.Prod.img_xs : undefined}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            maxHeight: 65,
            objectFit: "scale-down",
          }}
        />
      </Grid>
      {/* code & name */}

      <Grid
        container
        item
        xs={type === 1 ? 2.5 : 4.5}
        sx={{ pl: 0.5 }}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        {[op.code, op.nome].map((item, index) => (
          <Typography
            noWrap
            title={item}
            key={item + index}
            textAlign="center"
            sx={{ width: "100%" }}
          >
            {item}
          </Typography>
        ))}
      </Grid>

      {/* price & quantity */}
      {op.is_simple ? (
        <>
          <Grid container item xs={2} justifyContent="center">
            <Typography>{op.quantity}</Typography>
          </Grid>
          <Grid container item xs={2} justifyContent="center">
            <Typography
              sx={{
                textDecoration: isDiscount && "line-through",
                color: isDiscount && "custom.primaryMid",
              }}
            >
              {getPrice(defaultPrice)}
            </Typography>
            {isDiscount && (
              <Typography sx={{ color: "custom.error", pl: 1 }}>
                {getPrice(op.price)}
              </Typography>
            )}
          </Grid>
          <Grid container item xs={2} justifyContent="center">
            <Typography
              sx={{
                textDecoration: isDiscount && "line-through",
                color: isDiscount && "custom.primaryMid",
              }}
            >
              {getPrice(op.quantity * defaultPrice)}
            </Typography>
            {isDiscount && (
              <Typography sx={{ color: "custom.error", pl: 1 }}>
                {getPrice(op.quantity * op.price)}
              </Typography>
            )}
          </Grid>
          {type === 1 && (
            <Grid container item xs={2} justifyContent="center">
              <Typography>{getPrice(op.price_sale)}</Typography>
            </Grid>
          )}
        </>
      ) : (
        <>
          <Grid item xs={2} />
          <Grid item xs={2} justifyContent="center">
            {op.prod_quantity}
          </Grid>
          {op.OrderSkus?.map((os, index) => (
            <Grid container item xs={12} key={os._id}>
              {index !== 0 && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </>
              )}
              {type !== 1 && <Grid item xs={1.5} />}
              <Grid item xs={type === 1 ? 4 : 4.5} sx={{ pl: 1 }}>
                --{os.attrs}
              </Grid>
              <Grid item xs={2} textAlign="center">
                <Typography>{os.quantity}</Typography>
              </Grid>
              <Grid item xs={2} textAlign="center">
                <Typography>{getPrice(os.price)}</Typography>
              </Grid>
              <Grid item xs={2} textAlign="center">
                <Typography>{getPrice(os.quantity * os.price)}</Typography>
              </Grid>
              {type === 1 && (
                <Grid item xs={2} textAlign="center">
                  <Typography>{getPrice(os.price_sale)}</Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </>
      )}
      <Grid item xs={12}>
        <Divider sx={{ width: "100%" }} />
      </Grid>
    </Grid>
  );
};
