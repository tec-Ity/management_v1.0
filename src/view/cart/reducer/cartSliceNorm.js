// import {
//   createAsyncThunk,
//   createSlice,
//   current,
//   nanoid,
// } from "@reduxjs/toolkit";

// const initialState = {
//   cartData: localStorage.getItem("cartData")
//     ? JSON.parse(localStorage.getItem("cartData"))
//     : {
//         carts: { byId: {}, allIds: [] },
//         orderProds: { byId: {}, allIds: [] },
//         orderSkus: { byId: {}, allIds: [] },
//       },
//   // 'cart1': {
//   // cartId: "",
//   // goodsPrice: 0,
//   // totItem: 0,
//   // OrderProds: {
//   //   objs: {
//   //     // op1: {
//   //     //   Prod: "op1",
//   //     //   nome: "opname1",
//   //     //   OrderSkus: ["os1", "os2"],
//   //     //   totSubSkus: 3,
//   //     // },
//   //   },
//   //   allIds: [],
//   // },
//   // OrderSkus: {
//   //   objs: {
//   //     // os1: { attrs: [], price_sale: 5, quantity: 2 },
//   //     // os2: { attrs: [], price_sale: 3, quantity: 1 },
//   //   },
//   //   allIds: [
//   //     // "os1", "os2"
//   //   ],
//   // },
//   // },
// };

// export const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     cartItemPost: {
//       reducer(state, action) {
//         try {
//           const { cartId, crt_at, upd_at, prod, sku } = action.payload;
//           // console.log(action.payload);
//           if (!prod) throw new Error("no valid prod");
//           if (!cartId) throw new Error("no valid cartId");

//           const { carts, orderProds, orderSkus } = state.cartData;

//           const cartTemp = carts.byId[cartId] || {};

//           const orderSkuTemp = orderSkus{
//             Sku: sku._id,
//             Prod: prod._id,
//             attrs: sku.attrs,
//             price_sale: sku.price_sale,
//             price_regular: sku.price_regular,
//             quantity: 1,
//           };

//           const orderProdTemp = {
//             Prod: prod._id,
//             nome: prod.nome,
//             unit: prod.unit,
//             price_regular: prod.price_regular,
//             price_sale: prod.price_sale,
//             OrderSkus: [sku._id],
//             quantity: 1,
//           };

//           //no cart before
//           if (cartId !== cartTemp.cartId) {
//             console.log("no cart");
//             //create new cart
//             cartTemp.cartId = cartId;
//             //add orderProds
//             orderProds.byId[prod._id] = orderProdTemp;
//             orderProds.allIds.push(prod._id);
//             cartTemp.OrderProds.push(prod._id);
//             //add orderSkus
//             if (sku) {
//               orderSkus.byId[sku._id] = orderSkuTemp;
//               orderSkus.allIds.push(sku._id);
//             }
//             cartTemp.totItem = 1;
//             cartTemp.goodsPrice = sku.price_sale || prod.price_sale;
//             cartTemp.crt_at = crt_at;
//             //update carts
//             carts.byId[cartId] = cartTemp;
//             carts.allIds.push(cartId);
//           } else {
//             //exist cart
//             const opTemp = orderProds.byId[prod.id];
//             if (opTemp) {
//               //exist prod
//               opTemp.OrderSkus.push(sku._id);
//               opTemp.totSubSkus += 1;
//             } else {
//               //new prod
//               cartTemp.OrderProds.objs[prod.id] = orderProdObjTemp;
//             }
//             //update cart
//             cartTemp.OrderSkus.objs[sku.Id] = orderSkuObjTemp;
//             cartTemp.totSkus += 1;
//             cartTemp.goodsPrice += 1;
//             cartTemp.upd_at = upd_at;
//             //update carts
//             state.carts[cartId] = cartTemp;
//           }
//         } catch (err) {
//           // console.log(err);
//         }
//       },
//       prepare(cartId, payload) {
//         let cartIdTemp = cartId;
//         let crt_at;
//         let upd_at = Date.now();
//         if (!cartIdTemp) {
//           cartIdTemp = nanoid();
//           crt_at = Date.now();
//         }
//         return {
//           payload: { cartId: cartIdTemp, upd_at, crt_at, ...payload },
//         };
//       },
//     },
//   },
//   extraReducers: {},
// });

// export const { cartItemPost, cartItemPut, cartItemDelete } = cartSlice.actions;
// export default cartSlice.reducer;
