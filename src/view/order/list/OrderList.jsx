import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  clearFlagField,
  getObjects,
  putObject,
  selectQuery,
  setQuery,
} from "../../../redux/fetchSlice";
//config
import {
  fetchObj as fetchObjOrder,
  fetchObjs as fetchObjsOrder,
} from "../../../config/module/order/orderConf";
import {
  fetchObj as fetchObjPurchase,
  fetchObjs as fetchObjsPurchase,
} from "../../../config/module/purOrder/purOrderConf";
import { fetchObjs as fetchObjsProd } from "../../../config/module/prod/prodConf";
import { fetchObjs as fetchObjsOrderProd } from "../../../config/module/orderProd/orderProdConf";

//component
import CusPageFront from "../../../component/page/CusPageFront";
import OrderDetail from "../component/OrderDetail.jsx";
import OrderCard from "../component/OrderCard.jsx";
import DateFilter from "../component/DateFilter";
import ClientFilter from "../component/ClientFilter.jsx";
import PaidTypeFilter from "../component/PaidTypeFilter";
import { fetchPostStorageOrders, getReOrder } from "../reducer/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../../component/modal/LoadingModal";
import ElectronPrintComp from "../../_print/ElectronPrintComp.jsx";
import ReceiptTemplate from "../../cart/reciept/ReceiptTemplate.jsx";
import SuccessSnackBar from "../../../component/popover/SuccessSnackBar.jsx";
import DropSearch from "../../../component/search/DropSearch";
import { fetchPostPrint } from "../reducer/orderSlice";
//mui
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment";
import InvoiceModal from "../../_invoice/InvoiceModal";
import { useRef } from "react";
import ReceiptTemplateA4 from "../../cart/reciept/ReceiptTemplateA4";
import PdfComp from "../../_print/PdfComp";
import fetchAnalysisObjsGetters from "../../dashboard/fetchAnalysisObjsGetters";
import { fetchAnalysis } from "../../dashboard/analysisSlice";
import getPrice from "../../../utils/price/getPrice";
import { DatePicker } from "@mui/x-date-pickers";

export default function OrderList({
  type = -1,
  section = 1,
  initQuery = {},
  userPage = false,
  showSearchParam = true,
}) {
  // const stringifyInitQuery = JSON.stringify(initQuery);
  const dispatch = useDispatch();
  const view = useSelector((state) => state.root.view);
  const analysisData = useSelector((state) => state.analysis.analysisData);

  // const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParam, setSearchParam] = useState("order");
  // const [reOrdered, setReOrdered] = useState(false);
  const [startPrint, setStartPrint] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  // console.log("startPrint", startPrint);
  const [printObj, setPrintObj] = useState(null);
  const [pdfObj, setPdfObj] = useState(null);
  const [orderUnpaid, setOrderUnpaid] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  // const putStatus = useSelector((state) => state.fetch.putStatus);
  const reOrderStatus = useSelector((state) => state.order.reOrderStatus);
  // const able_PCsell = useSelector((state) => state.auth?.userInfo?.able_PCsell);
  const hide_orders = useSelector(
    (state) => state.auth?.userInfo?.Shop?.cassa_auth?.hide_orders
  );
  const orders = useSelector((state) => state.order.orders);
  // console.log(orders);
  const storageOrderPostStatus = useSelector(
    (state) => state.order.storageOrderPostStatus
  );
  const offlineMode = useSelector((state) => state.root.settings)?.offlineMode;
  const userInfo = useSelector((state) => state.auth.userInfo);

  const isMB = view === "MB";
  // const [curObj, setCurObj] = useState();
  const fetchObjs = useMemo(
    () =>
      searchParam === "order"
        ? type === 1
          ? fetchObjsPurchase
          : fetchObjsOrder
        : fetchObjsOrderProd,
    [type, searchParam]
  );

  const fetchObj = useMemo(
    () => (type === 1 ? fetchObjPurchase : fetchObjOrder),
    [type]
  );
  const query = useSelector(selectQuery(fetchObjs.flag));

  const onProdSelected = (obj) => {
    console.log(obj, type);
    dispatch(
      setQuery({
        fetchObjs: fetchObjsOrderProd,
        query: { Prod: obj._id, type_Order: type },
      })
    );
    dispatch(getObjects({ fetchObjs: fetchObjsOrderProd }));
  };

  const onPutOrderPaidStatus = (_id, isPaid) => {
    dispatch(putObject({ fetchObj, id: _id, data: { obj: { isPaid } } }));
    isPaid ? setOrderUnpaid(null) : setOrderUnpaid(_id);
  };
  const onPutOrderPass = (_id) => {
    dispatch(
      putObject({ fetchObj, id: _id, data: { obj: { is_pass: true } } })
    );
  };

  // const onReorder = (obj) => (isModify) => {
  //   dispatch(getReOrder({ order: obj, isModify, type }));
  //   setReOrdered(true);
  //   dispatch(setTabIndex(1));
  // };
  const onPrint = (obj) => () => {
    if (isMB) {
      setShowPaperModal(true);
    } else {
      setPrintObj(obj);
      setStartPrint(true);
      setAlertMsg("开始打印");
    }
  };
  const onPdf = (obj) => () => {
    setPdfObj(obj);
  };
  const onInvoice = (obj) => {
    setInvoiceOrder(obj);
  };

  //init query
  useEffect(() => {
    // const getSteps = async () => {
    //   const stepRes = await axios_Prom("/Steps");
    //   console.log(stepRes);
    // };
    // getSteps();
    section === 1 &&
      dispatch(
        setQuery({
          fetchObjs,
          query: { crt_after: moment().format("MM/DD/YYYY") },
        })
      );
  }, []);

  const busType = type === 1 ? "purchase" : "sale";

  const showUploadOrder =
    // able_PCsell &&
    orders?.length > 0 && section === 1;
  // console.log(1111, hide_orders);
  //fetch analysis data

  useEffect(() => {
    const fetchAnalysisObjs = fetchAnalysisObjsGetters?.general(
      {
        type_Order: type,
        is_virtual: false,
        crt_after: moment().format("MM/DD/YYYY"),
      },
      "singleData"
    );
    console.log(fetchAnalysisObjs, query);
    fetchAnalysisObjs && dispatch(fetchAnalysis({ objs: fetchAnalysisObjs }));
  }, [dispatch, type]);

  const fetchObjToPass = useMemo(
    () =>
      section === 1
        ? {
            ...fetchObjs,
            query: {
              ...fetchObjs.query,
              pagesize: hide_orders ? 1 : 30,
              User_Oder: hide_orders ? userInfo._id : "",
              crt_after: moment().format("MM/DD/YYYY"),
              ...initQuery,
            },
          }
        : {
            ...fetchObjs,
            query: {
              ...fetchObjs.query,
              ...initQuery,
            },
          },
    [fetchObjs, hide_orders, initQuery, section, userInfo._id]
  );
  console.log(analysisData, analysisData?.singleData?.[0]?.count);
  const Filters = React.useMemo(
    () =>
      section === -1 || showUploadOrder
        ? [
            ...(section === -1
              ? [
                  DateFilter,
                  (props) =>
                    !userPage && <ClientFilter {...props} type={type} />,
                  PaidTypeFilter,
                ]
              : []),
            //upload storage order button
            (props) =>
              showUploadOrder ? (
                <IconButton
                  sx={{ width: 110, borderRadius: "20px" }}
                  onClick={() => {
                    setSubmitted(true);
                    dispatch(fetchPostStorageOrders());
                  }}
                >
                  <CloudUploadIcon sx={{ color: "primary.main", mr: 0.5 }} />
                  <Typography variant="button">上传订单</Typography>
                </IconButton>
              ) : (
                <></>
              ),
          ]
        : null,
    [dispatch, section, showUploadOrder, type, userPage]
  );
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        // border: "1px solid",
      }}
    >
      <CusPageFront
        back={section === -1}
        busType={busType}
        key={"order" + type}
        fetchObjs={fetchObjToPass}
        fetchObj={fetchObj}
        initFetch={!offlineMode || section === -1}
        initObjects={
          section === 1 && (offlineMode || orders?.length > 0) ? orders : null
        }
        extraHeaderContentFront={
          <Box
            sx={{
              height: 32,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              m: 0.5,
              borderRadius: "15px",
              backgroundColor: "#ffffffAA",
            }}
          >
            <Typography sx={{ mr: 2 }}>
              今日销售 总数：{analysisData?.singleData?.[0]?.count}
            </Typography>
            <Typography>
              总金额：{getPrice(analysisData?.singleData?.[0]?.order_imp)}
            </Typography>
          </Box>
        }
        // mergeInitObjects={!offlineMode}
        CardUI={(props) => <OrderCard {...props} busType={busType} />}
        DetailCardUI={(obj, onDelete) =>
          obj && (
            <>
              <OrderDetail
                busType={busType}
                fullInfo
                obj={obj}
                onDelete={onDelete}
                // onReorder={onReorder(obj)}
                onPrint={onPrint(obj)}
                onInvoice={onInvoice}
                onPdf={onPdf(obj)}
                // isPaid={!(orderUnpaid === obj._id && putStatus === "succeed")}
                onPutOrderPaidStatus={onPutOrderPaidStatus}
                onPutOrderPass={onPutOrderPass}
              />
              <Dialog
                open={showPaperModal}
                onClose={() => setShowPaperModal(false)}
              >
                <DialogTitle>选择纸张大小</DialogTitle>
                <DialogContent>
                  <Stack spacing={2}>
                    {["80mm", "A4", "A5"].map((size) => (
                      <Button
                        key={size}
                        variant="contained"
                        color={busType + "Light"}
                        onClick={() => {
                          dispatch(
                            fetchPostPrint({
                              orderId: obj._id,
                              type: obj.type_order,
                              size,
                            })
                          );
                          setAlertMsg("开始打印");
                          setShowPaperModal(false);
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </Stack>
                </DialogContent>
              </Dialog>
              <SuccessSnackBar msg={alertMsg} onClose={() => setAlertMsg("")} />
            </>
          )
        }
        Filters={Filters}
        showSearch={section === -1}
        customSearch={
          searchParam === "prod" && (
            <DropSearch
              allowKeyboard
              fetchObjs={fetchObjsProd}
              onSelect={onProdSelected}
              inputStyle={
                (userPage && { borderColor: `${busType}Mid.main` }) || {}
              }
            />
          )
        }
        SearchParamSelector={
          section === -1 && showSearchParam ? (
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
              sx={{
                // display: { xs: "none", md: "flex" },
                width: "fit-content",
              }}
            >
              <FormControlLabel
                value="order"
                control={<Radio size="small" />}
                label={t("search.code")}
                sx={{ color: searchParam === "order" && "saleMid.main" }}
              />
              <FormControlLabel
                value="prod"
                control={<Radio size="small" />}
                label={t("search.prod")}
                sx={{
                  mr: 0,
                  color: searchParam === "prod" && "saleMid.main",
                }}
              />
            </RadioGroup>
          ) : null
        }
        listTitle={
          section === 1
            ? hide_orders
              ? "当前订单"
              : "今日订单"
            : userPage
            ? null
            : type === 1
            ? "采购单"
            : "订单中心"
        }
        listNoneMsg={type === 1 ? "暂无采购单" : "暂无订单"}
        detailTitle={type === 1 ? "采购单详情" : "订单详情"}
        showSearchBorder={userPage}
        // buttons={buttons}
      />

      <LoadingModal open={reOrderStatus === "loading"} />
      <SuccessSnackBar
        msg={submitted && storageOrderPostStatus && "订单传输成功！"}
        onClose={() => setSubmitted(false)}
      />
      {/* //////////print ////////////////// */}
      {!isMB && (
        <ElectronPrintComp
          startPrint={startPrint}
          printContent={printObj && <ReceiptTemplate order={printObj} />}
          onPrintDone={() => {
            setStartPrint(false);
            setPrintObj(null);
          }}
        />
      )}
      <InvoiceModal
        open={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
      />
      <PdfComp
        content={pdfObj && <ReceiptTemplateA4 order={pdfObj} />}
        title={pdfObj?.code}
        onSave={() => setPdfObj(null)}
      />
    </Container>
  );
}
