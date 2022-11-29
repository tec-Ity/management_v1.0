import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import {
  fetchObj as fetchObjOrder,
  fetchObjs as fetchObjsOrder,
  fetchObjStep,
  populateObjs as populateObjsOrder,
} from "../../../config/module/order/orderConf";
import {
  fetchObj as fetchObjPurOrder,
  fetchObjs as fetchObjsPurOrder,
  populateObjs as populateObjsPurOrder,
} from "../../../config/module/purOrder/purOrderConf";
import {
  cartItemPost,
  cartSubjectPost,
  initCart,
  setCartOrderModifyId,
} from "../../cart/reducer/cartSlice";
import { fetchObj } from "../../../config/module/prod/prodConf";
import { axios_Prom, fetch_Prom } from "../../../api/api";
import { getObject, getObjects, putObject } from "../../../redux/fetchSlice";
import moment from "moment";
const initialState = {
  orders: localStorage.getItem("orders")
    ? JSON.parse(localStorage.getItem("orders"))
    : [],
  cacheOrder: {},
  postedOrder: {},
  orderPostStatus: "idle",
  orderPutStatus: "idle",
  reOrderError: "",
  reOrderStatus: "",
  storageOrderPostStatus: "idle",
  error: "",
};

export const fetchOrderPost = createAsyncThunk(
  "cart/fetchOrderPost",
  async ({ cartId = null }, { getState, rejectWithValue, dispatch }) => {
    // console.log(type);
    try {
      //init return result
      const offlineMode = getState().root?.settings?.offlineMode;
      const returnRes = {
        offline: offlineMode,
        order: null,
        id: nanoid(),
      };
      //generate cart
      let cartPost = cartId
        ? getState().cart.carts.find((cart) => cart.cartId === cartId)
        : getState().cart.curCart;
      if (!cartPost.OrderProds || cartPost.OrderProds.length === 0)
        throw new Error("cart empty");
      if (cartPost.toPay !== 0) throw new Error("Not Paid");

      if (getState().curModifyMethod) throw new Error("unfinished payment!");
      // console.log("cart post", cartPost);
      const type = cartPost.type;
      const obj = {};

      obj.OrderProds = cartPost.OrderProds.map((op) => {
        const opTemp = {
          Prod: op.Prod,
          is_simple: op.is_simple,
          nome: op.nome,
          code: op.code,
          at_crt: Date.now(),
        };
        if (!op.OrderSkus || op.OrderSkus.length === 0) {
          opTemp.quantity = op.quantity; //server
          opTemp.price = op.price; //se
          opTemp.price_sale = op.price_sale;
          opTemp.price_cost = op.price_cost;
        } else
          opTemp.OrderSkus = op.OrderSkus.map((os) => ({
            Sku: os.Sku,
            quantity: os.quantity,
            price: os.price,
            attrs: os.attrs
              ?.map((attr) => `${attr.nome}:${attr.option}`)
              ?.join(","),
          }));
        return opTemp;
      });

      obj.type_ship = 0;
      if (type === 1) {
        obj.type_Order = 1;
        obj.Supplier = cartPost.subject?._id;
      } else {
        obj.Client = cartPost.subject?._id;
      }

      // obj.rate = cartPost.rate;
      obj.paidTypeObj =
        cartPost.PaidType ||
        getState().paymentMethods?.byId[getState().paymentMethods?.allIds[0]]; //default payment
      obj.Paidtype = obj.paidTypeObj?._id; //api Paid't'ype, not Paid'T'ype
      obj.price_coin = //server
        cartPost.totExchange >= 0 ? cartPost.totExchange : cartPost.totPrice;
      obj.order_imp = cartPost.totPrice;
      obj.goods_quantity = cartPost.totItem;
      obj.order_sale = cartPost.goodsSale;
      obj.is_tax = cartPost.isTax;
      obj.ship_sale = cartPost.shipping;
      obj.isPaid = true;
      obj.subject = cartPost.subject;
      const { is_virtual, show_crt, code } = cartPost;
      if (is_virtual) {
        obj.is_virtual = is_virtual;
        obj.show_crt = show_crt || moment().format("MM/DD/YYYY");
        obj.code = code;
      }

      console.log("obj post", obj);
      //return when offline mode is on
      if (offlineMode && cartPost.type === -1) {
        dispatch(initCart({ type, overRide: true }));
        return { ...returnRes, order: obj };
      }

      const fetchObj = type === 1 ? fetchObjPurOrder : fetchObjOrder;
      const postRes = await axios_Prom(
        `${fetchObj.api}?populateObjs=${JSON.stringify(
          fetchObj.query.populateObjs
        )}`,
        "POST",
        { obj, Order: cartPost.Order }
      );
      console.log("postRes", postRes);
      if (postRes.status === 200) {
        dispatch(initCart({ type, overRide: true }));
        return { ...returnRes, order: postRes.data.object };
      } else if (
        postRes.status === 600 &&
        cartPost.type === -1
        // &&
        // getState().root.view === "PC"
      ) {
        dispatch(initCart({ type, overRide: true }));
        return { ...returnRes, offline: true, order: obj };
      } else return rejectWithValue(postRes.message);
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrderPut = createAsyncThunk(
  "order/fetchOrderPut",
  async ({ orderId, stepId }, { dispatch, getState }) => {
    const res = await axios_Prom(
      `${fetchObjStep.api}/${orderId}?${JSON.stringify(populateObjsOrder)}`,
      "PUT",
      { obj: { Step_id: stepId } }
    );
    // const res = await dispatch(
    //   putObject({
    //     fetchObj: fetchObjStep,
    //     id: orderId,
    //     data: { obj: { Step_id: stepId } },
    //   })
    // );
    console.log(res);
    if (res.status === 200)
      dispatch(getObject({ fetchObj: fetchObjOrder, id: orderId }));
  }
);

export const fetchPostPrint = createAsyncThunk(
  "cart/fetchPostPrint",
  async ({ orderId, type, size = "80mm" }) => {
    try {
      if (!orderId) throw new Error("no order ID");
      //typePrint
      const printPostRes = await fetch_Prom(
        `/addTicket/${orderId}?typePrint=${size}&populateObjs=${JSON.stringify(
          type === 1 ? populateObjsPurOrder : populateObjsOrder
        )}`
      );
      console.log("printPost", printPostRes);
    } catch (err) {
      console.log(err);
    }
  }
);

export const getReOrder = createAsyncThunk(
  "order/getReOrder",
  async (
    { order, isModify = false, type },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      if (!order || !order.OrderProds?.length > 0)
        return rejectWithValue("invalid order");
      dispatch(initCart({ type, isModify, overRide: true }));
      const missingProds = [];

      const prodsAll = getState().prodStorage.prodsAll;
      // loop orderprods to get updated prods
      order.OrderProds.forEach(async (op) => {
        //check local
        let curProd = prodsAll.find((prod) => op.Prod._id === prod._id);

        //if not in local, check server
        if (!curProd) {
          const prodRes = await fetch_Prom(
            `${fetchObj.api}/${op.Prod._id}?populateObjs=${JSON.stringify(
              fetchObj.query?.populateObjs
            )}`
          );
          if (prodRes.status === 200) curProd = prodRes.data.object;
          else missingProds.push(op.Prod);
        }
        console.log(1111, curProd);
        //if not in server neither
        //continue forEach
        if (!curProd) return;

        //modify order
        //set order ID in the cart
        if (isModify) {
          dispatch(setCartOrderModifyId(order._id));
        }

        //cart post
        if (curProd.is_simple)
          dispatch(
            cartItemPost({
              prod: curProd,
              initPrice: isModify && op.price,
              initQuantity: op.quantity,
            })
          );
        //multi prod
        else {
          //sku post & put
          op.OrderSkus?.forEach((osku, index) => {
            console.log(2222, osku);
            //always post 1st sku
            dispatch(
              cartItemPost({
                sku: { ...osku, _id: osku.Sku },
                prod: curProd,
                initPrice: isModify && osku.price,
                initQuantity: osku.quantity,
              })
            );
          });
        }
      });

      //put subject
      dispatch(
        cartSubjectPost({
          subject: order.type_Order === 1 ? order.Supplier : order.Client,
        })
      );

      if (missingProds.length > 0) {
        return rejectWithValue(`${missingProds.length} prods missing`);
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPostStorageOrders = createAsyncThunk(
  "order/fetchPostStorageOrders",
  async (payload, { getState, dispatch }) => {
    try {
      const returnRes = {
        errorOrder: [],
      };
      const orders = getState().order.orders;
      if (!orders.length > 0) return returnRes;
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const postRes = await axios_Prom(
          `${fetchObjOrder.api}?populateObjs=${JSON.stringify(
            fetchObjOrder.query.populateObjs
          )}`,
          "POST",
          { obj: order, Order: order.Order }
        );
        console.log(postRes);
        if (postRes.status === 200) {
        } else returnRes.errorOrder.push(order);
      }
      const hide_orders =
        getState().auth?.userInfo?.Shop?.cassa_auth?.hide_orders;
      dispatch(
        getObjects({
          fetchObjs: {
            ...fetchObjsOrder,
            query: { ...fetchObjsOrder.query, pagesize: hide_orders && 1 },
          },
        })
      );
      return returnRes;
    } catch (err) {
      console.log(err);
    }
  }
);
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetError: (state, action) => {
      state.error = "";
    },
  },
  extraReducers: {
    [fetchOrderPost.pending]: (state) => {
      state.orderPostStatus = "loading";
    },
    [fetchOrderPost.fulfilled]: (state, action) => {
      state.orderPostStatus = "succeed";
      const { offline, order, id } = action.payload;
      if (offline) {
        order.is_offline = true;
        order.is_storage = true;
        order.storageId = id;
        order.at_crt = Date.now();
        order.code = id;
        order._id = id;
        state.orders.push(order);
      }
      state.postedOrder = order;
    },
    [fetchOrderPost.rejected]: (state, action) => {
      state.orderPostStatus = "error";
      console.log("error", action.payload, action.error);
      state.error = action.payload;
    },
    [fetchOrderPut.pending]: (state) => {
      state.orderPutStatus = "loading";
    },
    [fetchOrderPut.fulfilled]: (state, action) => {
      state.orderPostStatus = "succeed";
    },
    [fetchOrderPut.rejected]: (state, action) => {
      state.orderPostStatus = "error";
    },
    [getReOrder.pending]: (state, action) => {
      state.reOrderStatus = "loading";
    },
    [getReOrder.fulfilled]: (state, action) => {
      state.reOrderStatus = "succeed";
      state.reOrderError = "";
    },
    [getReOrder.rejected]: (state, action) => {
      console.log(action.payload);
      state.reOrderStatus = "error";
      state.reOrderError = action.payload;
    },
    [fetchPostPrint.rejected]: (state, action) => {
      console.log(action.payload);
    },
    [fetchPostStorageOrders.fulfilled]: (state, action) => {
      state.storageOrderPostStatus = "succeed";
      const { errorOrder } = action.payload;
      state.orders = errorOrder;
    },
  },
});

export const { resetError } = orderSlice.actions;

export default orderSlice.reducer;
