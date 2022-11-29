import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  resetProdsMultiCode,
  resetProdsShow,
  searchProdCode,
  searchProdScanned,
  setIsAddNewProd,
  updateProdStorage,
} from "../_prodStorage/reducer/ProdStorageSlice";
import { useDispatch } from "react-redux";
import {
  cartSubjectPost,
  cartItemDelete,
  cartItemPost,
  cartItemPut,
  initCart,
  resetPayment,
  fetchPaymentMethods,
  openMultiSkuModal,
  // resetError,
  clearModifiedProdsInfoInCart,
} from "./reducer/cartSlice";
import {
  fetchOrderPost,
  fetchPostPrint,
  resetError,
} from "../order/reducer/orderSlice";
import { fetchObj } from "../../config/module/prod/prodConf";
import prodFormInputs, {
  prodFormImg,
} from "../../config/module/prod/prodFormInputs";
import CusPostModal from "../../component/modal/CusPostModal.jsx";
import ErrorSnackBar from "../../component/popover/ErrorSnackBar.jsx";
import FiscalPrintComp from "../_print/FiscalPrintComp.jsx";
import ClientModal from "../../component/modal/ClientModal";
import ReceiptTemplate from "./reciept/ReceiptTemplate.jsx";
import ReceiptModal from "./modal/ReceiptModal";
import SkuModal from "./modal/SkuModal";
import CartPC from "./page/CartPC";
import CartMB from "./page/CartMB";
import { setTabIndex } from "../../redux/rootSlice";
import ElectronPrintComp from "../_print/ElectronPrintComp";
import SuccessSnackBar from "../../component/popover/SuccessSnackBar";
import { useNavigate } from "react-router-dom";
import CusDialog from "../../component/modal/CusDialog";
import getPrice from "../../utils/price/getPrice";
import ProdMultiCodesList from "./prodList/ProdMultiCodesList";
import { homePage } from "../../config/general/router/routerConf";
const UIs = {
  PC: CartPC,
  MB: CartMB,
};

export default function CartPage({ type = -1, section }) {
  const busType = type === 1 ? "purchase" : "sale";
  // const supplierId = useSelector((state) =>
  //   state.cart.curCart.type === 1 ? state.cart.curCart.Subject?._id : ""
  // );
  const prodStorageStatus = useSelector((state) => state.prodStorage.getStatus);

  //init
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //selecter
  const view = useSelector((state) => state.root.view);
  const fiscalPrinter = useSelector(
    (state) => state.root.settings?.fiscalPrinter
  );
  const isMB = view === "MB";
  const prodsShow = useSelector((state) => state.prodStorage.prodsShow);
  const curCart = useSelector((state) => state.cart.curCart);
  const postedOrder = useSelector((state) => state.order.postedOrder);
  const orderPostStatus = useSelector((state) => state.order.orderPostStatus);
  const showMultiSkuModal = useSelector(
    (state) => state.cart.showMultiSkuModal
  );
  const curMultiSkuProd = useSelector((state) => state.cart.curMultiSkuProd);
  console.log(curCart);

  const isAddNewProd = useSelector((state) => state.prodStorage.isAddNewProd);
  const newProdCode = useSelector((state) => state.prodStorage.newProdCode);
  const reduxError = useSelector((state) => state.order.error);
  const mProdsInfoInCart = useSelector((state) => state.cart.mProdsInfoInCart);
  const dProdsInfoInCart = useSelector((state) => state.cart.dProdsInfoInCart);
  //state
  const [cartPosted, setCartPosted] = useState(false);
  const [startPrint, setStartPrint] = useState(false);
  const [startFiscal, setStartFiscal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [error, setError] = useState("");
  const [fiscalOperation, setFiscalOperation] = useState({
    instruction: "",
    payload: "",
  });
  // console.log(cartPosted, orderPostStatus);

  //func
  const handleItemPost = useCallback(
    (prod, sku, initQuantity = 1, initPrice) =>
      () => {
        // console.log(prod, sku);
        dispatch(
          cartItemPost({
            prod,
            sku,
            type,
            initQuantity,
            initPrice: parseFloat(initPrice),
          })
        );
      },
    [dispatch]
  );

  const handleItemPut = useCallback(
    (prodId, skuId, quantity, price) => () => {
      // console.log(prodId, skuId, quantity, price);
      dispatch(cartItemPut({ prodId, skuId, quantity, price }));
    },
    [dispatch]
  );

  const handleItemDelete = useCallback(
    (prodId, skuId) => () => {
      // console.log("del");
      dispatch(cartItemDelete({ prodId, skuId }));
    },
    [dispatch]
  );

  const handleClickMulti = useCallback(
    (prod) => () => {
      if (prod) {
        dispatch(openMultiSkuModal({ open: true, prod }));
      }
    },
    [dispatch]
  );

  const handleSearchProd = useCallback(
    (code, select) => {
      // console.log(code, select);
      if (code && code.length > 1) {
        if (select) dispatch(searchProdScanned({ code }));
        else dispatch(searchProdCode({ code }));
      } else dispatch(resetProdsShow());
    },
    [dispatch]
  );

  const handleAddProd = useCallback(
    (e, value, clearCB) => {
      // console.log(e, value, prodsShow);
      if (e.code === "NumpadAdd" || e.code === "BracketRight") {
        if (prodsShow.length > 0) {
          dispatch(cartItemPost({ prod: prodsShow[0], type }));
          clearCB();
        } else {
          setError("没有找到相应产品");
        }
      }
    },
    [dispatch, prodsShow, type]
  );

  const handleSelectClient = (subject) => {
    // console.log(subject);
    dispatch(cartSubjectPost({ subject, type }));
    setShowClientModal(false);
  };

  //effects
  //init cart & payment methods
  useEffect(() => {
    // console.log(
    //   11112222,
    //   curCart.cartId,
    //   curCart.type,
    //   type,
    //   curCart?.subject?._id
    // );
    if (type === -1 || (type === 1 && curCart?.subject?._id)) {
      if (!curCart.cartId || (type && curCart.type !== type))
        dispatch(initCart({ type }));
    }
    dispatch(fetchPaymentMethods());
    // dispatch(resetProdsShow());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, curCart?.subject?._id]);

  //reset prods show
  useEffect(() => {
    prodStorageStatus === "succeed" && dispatch(resetProdsShow());
  }, [prodStorageStatus]);

  //reset payment && fiscal display
  useEffect(() => {
    !isNaN(parseFloat(curCart.goodsPrice)) && dispatch(resetPayment());
    if (fiscalPrinter && !isNaN(parseFloat(curCart.goodsPrice)))
      setFiscalOperation({
        instruction: "display",
        payload: `EURO\t\t\t\t\t\t\t\t\t${getPrice(curCart.goodsPrice, 2, "")}`,
      });
  }, [dispatch, curCart.goodsPrice]);

  //hot keys
  useEffect(() => {
    const listener = (e) => {
      //pay
      // console.log(e.code);
      if (
        e.code === "NumpadMultiply" &&
        orderPostStatus !== "loading" &&
        cartPosted === false
      ) {
        dispatch(fetchOrderPost({}));
        setCartPosted(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [dispatch]);

  // //reset payment button when post error
  // useEffect(() => {
  //   reduxError && setCartPosted(false);
  // }, [reduxError]);

  //pad buttons
  const buttons = [
    {
      label: curCart.subject
        ? curCart.subject.nome
        : type === 1
        ? "供应商"
        : "会员",
      handleClick: () => {
        // if (type === 1 && curCart.subject) return;
        setShowClientModal(true);
      },
      sx: {
        bgcolor: curCart.subject ? `${busType}Light.main` : "",
      },
    },
    // { label: "优惠", color: null, handleClick: () => {} },
    {
      label: type === 1 ? "采购" : "支付",
      sx: { bgcolor: `${busType}Light.main` },
      // disabled: cartPosted,
      handleClick: () => {
        if (orderPostStatus !== "loading") {
          dispatch(fetchOrderPost({}));
          setCartPosted(true);
        }
      },
    },
  ];
  // console.log(showClientModal);
  // console.log(orderPostStatus);
  // console.log(cartPosted, orderPostStatus);
  const UI = UIs[view];
  // console.log(2222222);
  return (
    <>
      <UI
        busType={busType}
        type={type}
        curCart={curCart}
        handleSearchProd={handleSearchProd}
        handleAddProd={handleAddProd}
        prodsShow={prodsShow}
        handleItemPost={handleItemPost}
        handleItemPut={handleItemPut}
        handleItemDelete={handleItemDelete}
        handleClickMulti={handleClickMulti}
        searchFocus={searchFocus}
        onSearchFocus={() => setSearchFocus(false)}
        buttons={buttons}
        section={section}
        cartPosted={cartPosted}
        orderPostStatus={orderPostStatus}
        showVirtual={!isMB}
      />
      {/* other components */}
      <>
        {/* ///////////////////// MODALS //////////////////// */}
        {/* //////////////////alert /////////// */}
        <ProdMultiCodesList
          busType={busType}
          type={type}
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
          handleClickMulti={handleClickMulti}
        />
        <ErrorSnackBar
          error={error || reduxError}
          onClose={() => {
            setError("");
            dispatch(resetError());
          }}
        />
        {/* multi sku modal */}
        <SkuModal
          type={type}
          open={showMultiSkuModal}
          onClose={() => dispatch(openMultiSkuModal({ open: false }))}
          prod={curMultiSkuProd}
          skus={curMultiSkuProd?.Skus}
          handleItemPut={handleItemPut}
          handleItemPost={handleItemPost}
          handleItemDelete={handleItemDelete}
        />
        {/* vip modal */}
        <ClientModal
          open={
            showClientModal ||
            (!cartPosted &&
              // orderPostStatus === "succeed" &&
              type === 1 &&
              (!curCart.subject || curCart.type === -1))
          }
          onClose={() => {
            if (type === 1 && !curCart.subject) {
              navigate(homePage);
              setError("请先选择供应商");
            } else setShowClientModal(false);
          }}
          type={type}
          handleSelectClient={handleSelectClient}
          allowAddNew
          showCancel={curCart.subject?.code}
        />
        {/* add new prod modal */}
        <CusPostModal
          fullScreen={isMB}
          isProdStorage
          open={isAddNewProd}
          onClose={() => dispatch(setIsAddNewProd({ open: false }))}
          title="Add Product"
          fetchObj={fetchObj}
          formInputs={prodFormInputs}
          fileInput={prodFormImg}
          defaultValue={{ code: newProdCode, codeFlag: newProdCode }}
          submittedCallback={(prod) => {
            // console.log(prod);
            dispatch(updateProdStorage([prod]));
            dispatch(resetProdsShow());
            handleItemPost(prod)();
          }}
        />
        {/* reciept modal */}
        {cartPosted && orderPostStatus === "succeed" && (
          <ReceiptModal
            open={cartPosted && orderPostStatus === "succeed"}
            onClose={() => {
              //手动关掉open 不触发onClose
              if (!isMB && fiscalPrinter) {
                setFiscalOperation({
                  instruction: "nonFiscal",
                  payload: postedOrder,
                });
                setStartFiscal(true);
              } else {
                setCartPosted(false);
                setSearchFocus(true);
                dispatch(setTabIndex(0));
              }
            }}
            order={postedOrder}
            setStartPrint={() => {
              if (isMB) {
                dispatch(
                  fetchPostPrint({
                    orderId: postedOrder._id,
                    type: postedOrder.type_order,
                  })
                );
                setCartPosted(false);
                setSearchFocus(true);
                dispatch(setTabIndex(0));
              }
              if (fiscalPrinter) {
                setStartFiscal(true);
                setFiscalOperation({
                  instruction: "fiscal",
                  payload: postedOrder,
                });
              } else setStartPrint(true);
            }}
            busType={busType}
          />
        )}
        {/* print */}
        {!isMB && (
          <ElectronPrintComp
            startPrint={startPrint}
            printContent={<ReceiptTemplate order={postedOrder} />}
            onPrintDone={() => {
              setStartPrint(false);
              setCartPosted(false);
              setSearchFocus(true);
            }}
          />
        )}
        {/* fiscal */}
        {fiscalPrinter && (
          <FiscalPrintComp
            type={fiscalPrinter}
            {...fiscalOperation}
            onFinish={() => {
              // console.log(2222222222, fiscalOperation);
              (fiscalOperation.instruction === "fiscal" ||
                fiscalOperation.instruction === "nonFiscal") &&
                setCartPosted(false);
              setFiscalOperation({ instruction: "", payload: "" });
              setSearchFocus(true);
            }}
          />
        )}
        <SuccessSnackBar
          msg={(startPrint || startFiscal) && "开始打印"}
          onClose={() => {
            isMB && setStartPrint(false);
            setStartFiscal(false);
          }}
          duration={1000}
        />

        <CusDialog
          open={Boolean(mProdsInfoInCart || dProdsInfoInCart)}
          onClose={() => dispatch(clearModifiedProdsInfoInCart())}
          showCloseIcon={false}
          title="注意：购物车商品变动"
          content={
            "以下商品" +
            (dProdsInfoInCart
              ? dProdsInfoInCart
                  .map(
                    (prod) =>
                      `${prod.nome?.slice(0, 10)}(${prod.code?.slice(0, 10)})`
                  )
                  .join("，") + "被删除"
              : "") +
            (mProdsInfoInCart
              ? mProdsInfoInCart
                  .map(
                    (prod) =>
                      `${prod.nome?.slice(0, 10)}(${prod.code?.slice(0, 10)})`
                  )
                  .join("，") + "信息有变动"
              : "") +
            "。已在购物车内被删除，请重新添加。"
          }
          actions={[
            {
              label: "知道了",
              onClick: () => dispatch(clearModifiedProdsInfoInCart()),
              variant: "contained",
            },
          ]}
        />
      </>
    </>
  );
}
