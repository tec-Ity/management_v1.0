import {
  createAsyncThunk,
  createSlice,
  // current,
  nanoid,
} from "@reduxjs/toolkit";
import { fetch_Prom } from "../../../api/api";
import { fetchObjs as fetchObjsPaidTypes } from "../../../config/module/setting/payment/type/paidTypeConf";

const initialState = {
  carts: localStorage.getItem("carts")
    ? JSON.parse(localStorage.getItem("carts"))
    : [],
  curCart: localStorage.getItem("curCart")
    ? JSON.parse(localStorage.getItem("curCart"))
    : {},
  postedOrder: {},
  enableMultiPayment: false,
  curModifyMethod: null, //modifying, unfinished process
  curCoin: {},
  paymentMethods: {},
  showMultiSkuModal: false,
  curMultiSkuProd: null,
  error: "",
};
//thunk
// export const fetchCartOrderPost = createAsyncThunk(
//   "cart/fetchCartOrderPost",
//   async ({ cartId = null }, { getState, rejectWithValue, dispatch }) => {
//     // console.log(type);
//     try {
//       let cartPost = cartId
//         ? getState().cart.carts.find((cart) => cart.cartId === cartId)
//         : getState().cart.curCart;
//       if (!cartPost.OrderProds || cartPost.OrderProds.length === 0)
//         throw new Error("cart empty");
//       if (cartPost.toPay !== 0) {
//         // getState().cart.error = "Not Paid";
//         throw new Error("Not Paid");
//       }
//       if (getState().curModifyMethod) throw new Error("unfinshed payment!");
//       // console.log("cart post", cartPost);
//       const type = cartPost.type;
//       const obj = {};

//       obj.OrderProds = cartPost.OrderProds.map((op) => {
//         const opTemp = {
//           Prod: op.Prod,
//         };
//         if (!op.OrderSkus || op.OrderSkus.length === 0) {
//           opTemp.quantity = op.quantity;
//           opTemp.price = op.price;
//         } else
//           opTemp.OrderSkus = op.OrderSkus.map((os) => ({
//             Sku: os.Sku,
//             quantity: os.quantity,
//             price: os.price,
//           }));

//         return opTemp;
//       });

//       obj.type_ship = 0;
//       if (type === 1) {
//         obj.type_Order = 1;
//         obj.Supplier = cartPost.subject?._id;
//       } else {
//         obj.Client = cartPost.subject?._id;
//       }

//       // obj.rate = cartPost.rate;
//       obj.Paidtype = //api Paid't'ype, not Paid'T'ype
//         cartPost.PaidType ||
//         getState().paymentMethods?.byId[getState().paymentMethods?.allIds[0]]; //default payment

//       obj.price_coin =
//         cartPost.totPrice >= 0 ? cartPost.totPrice : cartPost.totExchange;
//       obj.is_tax = cartPost.isTax;
//       obj.ship_sale = cartPost.shipping;
//       obj.isPaid = true;
//       console.log("obj post", obj);
//       const fetchObj = type === 1 ? fetchObjPurOrder : fetchObjOrder;
//       const postRes = await fetch_Prom(
//         `${fetchObj.api}?populateObjs=${JSON.stringify(
//           fetchObj.query.populateObjs
//         )}`,
//         "POST",
//         { obj, Order: cartPost.Order }
//       );
//       console.log("postRes", postRes);
//       if (postRes.status === 200) {
//         dispatch(initCart(type));
//         return postRes.data.object;
//       } else return rejectWithValue(postRes.message);
//     } catch (err) {
//       console.log(err);
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const fetchPaymentMethods = createAsyncThunk(
  "cart/fetchPaymentMethods",
  async () => {
    const methodsRes = await fetch_Prom(
      `${fetchObjsPaidTypes.api}?populateObjs=${JSON.stringify(
        fetchObjsPaidTypes.query.populateObjs
      )}`
    );
    // console.log(methodsRes);
    if (methodsRes.status === 200) {
      return methodsRes.data.objects;
    }
  }
);

// export const fetchPostPrint = createAsyncThunk(
//   "cart/fetchPostPrint",
//   async ({ orderId, type, size = "80mm" }) => {
//     try {
//       if (!orderId) throw new Error("no order ID");
//       //typePrint
//       const printPostRes = await fetch_Prom(
//         `/addTicket/${orderId}?typePrint=${size}&populateObjs=${JSON.stringify(
//           type === 1 ? populateObjsPurOrder : populateObjsOrder
//         )}`
//       );
//       console.log("printPost", printPostRes);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );

export const handleModifyProds = createAsyncThunk(
  "cart/handleModifyProds",
  ({ dProds, mProds }, { getState, dispatch }) => {
    try {
      // console.log("handleModifyProds", dProds, mProds);
      if (!dProds?.length > 0 && !mProds?.length > 0) return;
      const { OrderProds } = getState().cart.curCart;
      const handleProdsInCart = (prodIds) => {
        if (prodIds?.length > 0) {
          let resArr = [];
          prodIds.forEach((prodId) => {
            for (let i = 0; i < OrderProds?.length; i++) {
              const op = OrderProds[i];
              if (op.Prod === prodId) {
                dispatch(cartItemDelete({ prodId }));
                resArr.push({ code: op.code, nome: op.nome });
                break;
              }
            }
          });
          return resArr.length > 0 ? resArr : null;
        }
      };
      const dProdsInfoInCart = handleProdsInCart(dProds);
      const mProdsInfoInCart = handleProdsInCart(mProds);
      return { dProdsInfoInCart, mProdsInfoInCart };
    } catch (err) {
      console.log(err);
    }
  }
);
//helper function
const resetPaymentMethods = (state, field) => {
  try {
    //no immer use spread operators
    let method;
    if (!field) {
      method = state.paymentMethods?.byId[state.paymentMethods?.allIds[0]];
      field = method.field;
    } else method = state.paymentMethods?.byId[field];

    const rate = method.Coin.rate;
    const initialPaymentMethods = state.initialPaymentMethods;
    const newMethods = {
      ...initialPaymentMethods,
      byId: {
        ...initialPaymentMethods.byId,
        [field]: {
          ...initialPaymentMethods.byId[field],
          price: state.curCart.totPrice * rate,
          active: true,
        },
      },
    };
    state.paymentMethods = newMethods;
    state.curCart.toPay = 0;
    state.curCart.change = 0;
    state.curCart.rate = rate;
    state.curCart.PaidType = { _id: method._id, code: method.code };
    state.curCart.totExchange = state.curCart.totPrice
      ? state.curCart.totPrice * rate
      : 0;
    state.curModifyMethod = null;
    state.curCoin = method.Coin;
  } catch (err) {
    console.log(err);
  }
};

// const modifyCheck = (state, field) => {
//   for (const [id, methodObj] of Object.entries(state.paymentMethods.byId)) {
//     if (methodObj.active && !methodObj.price) {
//       state.error = "unsettled process";
//       return false;
//     }
//     if (methodObj.modifying) {
//       state.error = "unfinished modify";
//       methodObj.errorMsg = "unfinished modify";
//       return false;
//     }
//   }
//   return true;
// };

//cartSlice
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetError: (state, action) => {
      state.error = "";
    },
    openMultiSkuModal: (state, action) => {
      try {
        const { open, prod } = action.payload;
        if (open) {
          if (!prod || !prod.Skus) throw new Error("no skus");
          if (!prod?.Skus?.length > 0)
            throw new Error("skus is not array or has 0 skus");
          state.showMultiSkuModal = true;
          state.curMultiSkuProd = prod;
        } else {
          state.showMultiSkuModal = false;
          state.curMultiSkuProd = null;
        }
      } catch (err) {
        console.log(err);
      }
    },
    modifyCheck: (state, action) => {
      const field = action.payload;
      if (field) {
        if (state.curModifyMethod === field) {
          state.paymentMethods.byId[field].errorMsg = "unfinished process";
        }
      }
    },
    setCurModifyMethod: (state, action) => {
      const field = action.payload;
      if (field) {
        state.curModifyMethod = field;
      } else state.curModifyMethod = null;
    },
    toggleEnableMultiPayment: (state, action) => {
      state.enableMultiPayment = !state.enableMultiPayment;
      resetPaymentMethods(state);
    },
    togglePaymentMethod: (state, action) => {
      const field = action.payload;
      for (let i = 0; i < state.paymentMethods.allIds.length; i++) {
        const id = state.paymentMethods.allIds[i];
        const error = state.paymentMethods.byId[id].errorMsg;
        if (error) {
          state.error = error;
          return;
        }
      }
      if (field) {
        const method = state.paymentMethods.byId[field];
        const rate = method.Coin.rate;
        //update totPrice when change method
        const { goodsPrice, isTax, iva, totPrice } = state.curCart;
        state.curCart.totExchange = totPrice * rate * (isTax ? 1 + iva : 1);

        if (!state.enableMultiPayment) {
          method.errorMsg = "";
          state.error = "";
        }
        if (field === "vip" && !state.curCart.subject?._id) {
          state.error = "请先录入会员";
          return;
        }
        if (!state.enableMultiPayment) {
          if (!method.active) {
            resetPaymentMethods(state, field);
          }
        } else {
          //multi payment
          if (!method.active) {
            if (state.curModifyMethod) {
              state.error = "请先完成之前的操作";
              return;
            }
            state.curModifyMethod = field;
            method.active = true;
            method.price = state.curCart.toPay;
            state.curCart.toPay = 0;
          } else {
            // if(field!=='cash')
            method.active = false;
            if (method.price) {
              state.curCart.toPay += method.price;
              method.price = null;
            }
          }
        }
      }
    },
    resetPayment: (state, action) => {
      if (state.paymentMethods.byId && state.paymentMethods.allIds)
        resetPaymentMethods(state);
    },
    updatePaymentMethodPrice: (state, action) => {
      try {
        const { field, price } = action.payload;
        if (field) {
          // if (!modifyCheck(state)) return;
          const method = state.paymentMethods.byId[field];
          if (!price) {
            method.errorMsg = "please enter a number";
            return;
          } // const cashMethod = state.paymentMethods.byId.cash;
          if (!state.enableMultiPayment) {
            if (price < state.curCart.totExchange) {
              method.errorMsg = "not enough";
              return;
            }
          }
          method.price = price;
          state.curCart.totPay = price;
          method.errorMsg = null;
          if (method.is_cash) {
            const changeTemp = method.price - state.curCart.totExchange;
            // console.log(changeTemp);
            state.curCart.change = changeTemp > 0 ? changeTemp : 0;
          }
          // const toPayTemp = state.curCart.toPay - price;
          // state.curCart.toPay = toPayTemp >= 0 ? toPayTemp : 0;

          state.curModifyMethod = null;
          state.error = null;
        }
      } catch (err) {
        console.log(err);
      }
    },
    initCart: {
      reducer(state, action) {
        // console.log("init");
        const { cartId, crt_at, type, isModify, overRide } = action.payload;
        // console.log(11111, state.curCart?.type, type);
        if (
          !overRide &&
          state.curCart?.OrderProds?.length > 0 &&
          state.curCart?.type === type
        )
          //case not init cart
          return;
        const cartTemp = {
          cartId: cartId,
          crt_at: crt_at,
          type: type,
          totItem: 0,
          goodsSale: 0, //商品原总价
          goodsPrice: 0, //商品总价
          subTotPrice: 0,
          totPrice: 0,
          toPay: 0, //未付
          change: 0, //找零
          OrderProds: [],
          isTax: false,
          iva: 0.22,
          shipping: 0,
          isModify,
        };
        state.curCart = cartTemp;
      },
      prepare({ type = -1, isModify = false, overRide = false }) {
        const cartIdTemp = nanoid();
        const crt_at = Date.now();
        return {
          payload: { cartId: cartIdTemp, crt_at, type, isModify, overRide },
        };
      },
    },
    cartSubjectPost: (state, action) => {
      const { subject } = action.payload;
      if (subject) state.curCart.subject = subject;
      else state.curCart.subject = null;
      if (state.curCart.type !== 1)
        state.carts.forEach((cart) => {
          if (cart.cartId === state.curCart.cartId) cart = state.curCart;
        });
    },
    cartItemPost: {
      reducer(state, action) {
        try {
          const {
            upd_at,
            prod,
            sku,
            initQuantity = 1,
            initPrice = null,
          } = action.payload;
          // console.log(action.payload);
          if (!prod) throw new Error("no valid prod");
          const quantity = parseInt(initQuantity);
          if (isNaN(quantity)) throw new Error("quantity must be a number");
          const type = state.curCart?.type;
          let orderSkuTemp;
          if (sku)
            orderSkuTemp = {
              Sku: sku._id,
              attrs: sku.attrs,
              price: initPrice
                ? initPrice
                : type === -1
                ? sku.price_sale
                : sku.price_cost,
              priceBase: type === -1 ? sku.price_regular : sku.price_cost,
              price_sale: sku.price_sale,
              price_cost: sku.price_cost,
              price_regular: sku.price_regular,
              quantity,
            };

          const orderProdTemp = {
            code: prod.code,
            codeSup: prod.codeSup,
            Prod: prod._id,
            nome: prod.nome,
            nomeTR: prod.nomeTR,
            img_url: prod.img_url,
            img_xs: prod.img_xs,
            // OrderSkus: [orderSkuTemp],
            is_simple: prod.is_simple,
            unit: prod.unit,
            price_regular: prod.price_regular,
            price: initPrice
              ? initPrice
              : type === -1
              ? prod.price_sale
              : prod.price_cost,
            priceBase: type === -1 ? prod.price_regular : prod.price_cost,
            price_sale: prod.price_sale,
            price_cost: prod.price_cost,
            quantity,
          };

          if (sku) orderProdTemp.OrderSkus = [orderSkuTemp];
          const cartTemp = state.curCart;

          let foundProd = false;
          for (let i = 0; i < cartTemp.OrderProds?.length; i++) {
            const orderProd = cartTemp.OrderProds[i];
            if (orderProd.Prod === prod._id) {
              //exsit prod
              // console.log("has prod");
              foundProd = true;
              if (sku) {
                if (!orderProd.OrderSkus) cartTemp.OrderProds[i].OrderSkus = [];
                cartTemp.OrderProds[i].OrderSkus.unshift(orderSkuTemp);
                cartTemp.OrderProds[i].quantity += quantity;
              } else throw new Error("Prod exist and no Sku provide");
            }
          }
          //new prod
          if (!foundProd) {
            // console.log("new prod");
            if (!cartTemp.OrderProds) cartTemp.OrderProds = [];
            cartTemp.OrderProds.unshift(orderProdTemp);
          }
          if (sku) {
            cartTemp.goodsSale += orderSkuTemp.priceBase * quantity;
            cartTemp.goodsPrice += orderSkuTemp.price * quantity;
          } else {
            cartTemp.goodsSale += orderProdTemp.priceBase * quantity;
            cartTemp.goodsPrice += orderProdTemp.price * quantity;
          }
          cartTemp.totItem += quantity;
          cartTemp.upd_at = upd_at;
          cartTemp.subTotPrice = cartTemp.goodsPrice;
          cartTemp.totPrice = cartTemp.goodsPrice;
          //update carts
          if (type !== 1)
            for (let i = 0; i < state.carts.length; i++) {
              let cart = state.carts[i];
              if (cart.cartId === cartTemp.cartId) {
                state.carts[i] = cartTemp;
              }
            }
        } catch (err) {
          console.log(err);
        }
      },
      prepare(payload) {
        let upd_at = Date.now();
        return {
          payload: { upd_at, ...payload },
        };
      },
    },
    cartItemPut: (state, action) => {
      try {
        const { prodId, skuId, quantity, price } = action.payload;
        const type = state.curCart?.type;
        if (!prodId) throw new Error("no prodId");
        if (!quantity && price !== null && isNaN(price))
          throw new Error("no quantity or price provided");
        // console.log('put',quantity, price, isNaN(price));
        let quantityDiff;
        let priceDiff;
        let foundSku = false;
        for (let i = 0; i < state.curCart.OrderProds?.length; i++) {
          const oProd = state.curCart.OrderProds[i];
          //found prod
          if (oProd.Prod === prodId) {
            //given sku not simple
            if (skuId) {
              for (let j = 0; j < oProd.OrderSkus.length; j++) {
                const oSku = oProd.OrderSkus[j];
                //found sku
                if (oSku.Sku === skuId) {
                  const priceOld = oSku.price * oSku.quantity;
                  if (quantity) {
                    quantityDiff = parseInt(quantity) - oSku.quantity;
                    state.curCart.totItem += quantityDiff;
                    state.curCart.goodsSale += quantityDiff * oSku.priceBase;
                    oProd.quantity += quantityDiff;
                    oSku.quantity = parseInt(quantity);
                  }
                  if (price !== null && !isNaN(price))
                    oSku.price = parseFloat(price);
                  priceDiff = oSku.price * oSku.quantity - priceOld;
                  state.curCart.goodsPrice += priceDiff;
                  foundSku = true;
                  break;
                }
              }
              if (foundSku) break;
            } else {
              //is simple
              const priceOld = oProd.quantity * oProd.price;
              if (quantity) {
                quantityDiff = parseInt(quantity) - oProd.quantity;
                oProd.quantity = parseInt(quantity);
                state.curCart.totItem += quantityDiff;
                state.curCart.goodsSale += quantityDiff * oProd.priceBase;
              }
              if (price !== null && !isNaN(price))
                oProd.price = parseFloat(price);
              priceDiff = oProd.quantity * oProd.price - priceOld;
              state.curCart.goodsPrice += priceDiff;
            }
          }
        }
        state.curCart.subTotPrice = state.curCart.goodsPrice;
        state.curCart.totPrice = state.curCart.goodsPrice;
        //update carts
        if (type !== 1)
          for (let i = 0; i < state.carts.length; i++) {
            if (state.carts[i].cartId === state.curCart.cartId)
              state.carts[i] = state.curCart;
          }
      } catch (err) {
        console.log(err);
      }
    },
    cartItemDelete: (state, action) => {
      try {
        const { prodId, skuId, type = -1 } = action.payload;
        if (!prodId) throw new Error("no prodId");
        let delSku = -1,
          delProd = -1;
        for (let i = 0; i < state.curCart.OrderProds.length; i++) {
          const oProd = state.curCart.OrderProds[i];
          //found Prod
          if (oProd.Prod === prodId) {
            if (skuId) {
              for (let j = 0; j < oProd.OrderSkus.length; j++) {
                const oSku = oProd.OrderSkus[j];
                if (oSku.Sku === skuId) {
                  delSku = j;
                  break;
                }
              }
              if (delSku !== -1) {
                const dSku = oProd.OrderSkus[delSku];
                state.curCart.goodsPrice -= dSku.price * dSku.quantity;
                state.curCart.goodsSale -= dSku.priceBased * dSku.quantity;
                state.curCart.totItem -= 1;
                oProd.OrderSkus.splice(delSku, 1);
                if (oProd.OrderSkus.length === 0) delProd = i;
                break;
              }
            } else delProd = i;
          }
        }
        if (delProd !== -1) {
          const dProd = state.curCart.OrderProds[delProd];
          if (dProd.is_simple) {
            state.curCart.goodsPrice -= dProd.price * dProd.quantity;
            state.curCart.goodsSale -= dProd.priceBase * dProd.quantity;
            state.curCart.totItem -= dProd.quantity;
          }
          state.curCart.OrderProds.splice(delProd, 1);
        }
        //update carts or del cart from cart
        state.curCart.subTotPrice = state.curCart.goodsPrice;
        state.curCart.totPrice = state.curCart.goodsPrice;
        if (type !== 1)
          for (let i = 0; i < state.carts.length; i++) {
            const cart = state.carts[i];
            if (cart.cartId === state.curCart.cartId) {
              // if (cart.OrderProds.length === 0) {
              //   state.curCart = {};
              //   delCart = i;
              // } else {
              state.carts[i] = state.curCart;
              // }
              break;
            }
          }
        // if (delCart !== -1) {
        //   state.carts.splice(delCart, 1);
        // }
      } catch (err) {
        console.log(err);
      }
    },
    setCartOrderModifyId: (state, action) => {
      state.curCart.Order = action.payload;
    },
    setCartGoodsPrice: (state, action) => {
      // const { goodsPrice, prevGoodsPrice } = state.curCart;
      // if (!isNaN(action.payload)) {
      //   if (!prevGoodsPrice) {
      //     state.curCart.prevGoodsPrice = goodsPrice;
      //   }
      //   state.curCart.goodsPrice = action.payload;
      // } else if (action.payload === "restart") {
      //   if (prevGoodsPrice) state.curCart.goodsPrice = prevGoodsPrice;
      // }
    },
    toggleCartIsTax: (state, action) => {
      const { isTax, shipping, goodsPrice, iva, rate } = state.curCart;
      state.curCart.isTax = !isTax;
      //check new isTax
      let afterTax = 0;
      if (!isTax) {
        afterTax = goodsPrice * (1 + iva) + shipping;
      } else {
        afterTax = goodsPrice;
      }

      state.curCart.subTotPrice = afterTax;
      state.curCart.totPrice = afterTax;
      state.curCart.totExchange = rate * afterTax;
    },
    setCartShipping: (state, action) => {
      const { subTotPrice, shipping } = state.curCart;
      if (!isNaN(action.payload) && action.payload >= 0) {
        state.curCart.shipping = action.payload;
        state.curCart.subTotPrice = subTotPrice - shipping + action.payload;
        state.curCart.totPrice = state.curCart.subTotPrice;
      }
    },
    setCartTotPrice: (state, action) => {
      if (!isNaN(action.payload) && action.payload >= 0) {
        state.curCart.totPrice = parseFloat(action.payload);
        resetPaymentMethods(state);
      }
    },
    handleCancelOptionalPayment: (state, action) => {
      resetPaymentMethods(state);
      state.curCart.subTotPrice = state.curCart.goodsPrice;
      state.curCart.totPrice = state.curCart.subTotPrice;
      state.curCart.shipping = 0;
      state.curCart.isTax = false;
    },
    clearModifiedProdsInfoInCart: (state) => {
      state.mProdsInfoInCart = null;
      state.dProdsInfoInCart = null;
    },
    setCartVirtual: (state, action) => {
      const { is_virtual, show_crt, code } = action.payload || {};
      // console.log(action.payload);
      if (is_virtual !== undefined) state.curCart.is_virtual = is_virtual;
      if (code !== undefined) state.curCart.code = code;
      if (show_crt !== undefined) state.curCart.show_crt = show_crt;
    },
  },
  extraReducers: {
    [fetchPaymentMethods.pending]: (state) => {
      state.fetchPaymentStatus = "loading";
    },
    [fetchPaymentMethods.fulfilled]: (state, action) => {
      state.fetchPaymentStatus = "succeed";
      const methods = action.payload;
      const byId = {},
        allIds = [];
      methods?.forEach((method) => {
        byId[method.code] = {
          ...method,
          field: method.code,
          label: method.code,
        };
        if (method.is_cash) allIds.unshift(method.code);
        else allIds.push(method.code);
        return;
      });
      state.paymentMethods = {
        byId,
        allIds,
      };
      state.initialPaymentMethods = {
        byId,
        allIds,
      };
      resetPaymentMethods(state);
    },
    [fetchPaymentMethods.rejected]: (state, action) => {
      state.fetchPaymentStatus = "error";
      state.error = action.payload;
    },
    [handleModifyProds.fulfilled]: (state, action) => {
      if (!action.payload) return;
      const { mProdsInfoInCart, dProdsInfoInCart } = action.payload;
      // console.log(
      //   "handleModifyProds fulfilled",
      //   mProdsInfoInCart,
      //   dProdsInfoInCart
      // );
      state.mProdsInfoInCart = mProdsInfoInCart;
      state.dProdsInfoInCart = dProdsInfoInCart;
    },
  },
});

//selectors
export const selectProdQuantity = (prodId) => (state) => {
  try {
    const prods = state.cart.curCart.OrderProds;
    // console.log(prods);
    if (prods && prods.length > 0) {
      const prod = prods.find((op) => op.Prod === prodId);
      // console.log(prod);
      return prod ? prod.quantity : 0;
    } else return 0;
  } catch (err) {
    console.log(err);
  }
};
export const selectProdPrice = (prodId) => (state) => {
  try {
    const prods = state.cart.curCart.OrderProds;
    // console.log(prods);
    if (prods && prods.length > 0) {
      const prod = prods.find((op) => op.Prod === prodId);
      // console.log(prod);
      return prod ? prod.price : 0;
    } else return 0;
  } catch (err) {
    console.log(err);
  }
};
export const selectSkuQuantity = (prodId, skuId) => (state) => {
  try {
    const oProds = state.cart.curCart.OrderProds;
    // console.log(oProds);
    if (!oProds || oProds.length === 0) return 0;
    const oProd = oProds?.find((op) => op.Prod === prodId);
    // console.log(oProd);
    if (!oProd || !oProd.OrderSkus || oProd.OrderSkus.length === 0) return 0;
    const oSku = oProd.OrderSkus?.find((os) => os.Sku === skuId);
    // console.log(oSku);
    if (!oSku) return 0;
    else return oSku.quantity;
  } catch (err) {
    console.log(err);
  }
};

export const {
  cartItemPost,
  cartItemPut,
  cartItemDelete,
  initCart,
  cartSubjectPost,
  togglePaymentMethod,
  toggleEnableMultiPayment,
  resetPayment,
  updatePaymentMethodPrice,
  setCurModifyMethod,
  modifyCheck,
  openMultiSkuModal,
  resetError,
  setCartOrderModifyId,
  setCartGoodsPrice,
  toggleCartIsTax,
  setCartShipping,
  setCartTotPrice,
  handleCancelOptionalPayment,
  clearModifiedProdsInfoInCart,
  setCartVirtual,
} = cartSlice.actions;
export default cartSlice.reducer;
