import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { axios_Prom, fetch_Prom } from "../../../api/api";
import { fetchObjs, populateObjs } from "../../../config/module/prod/prodConf";

import {
  cartItemPost,
  cartItemPut,
  handleModifyProds,
  openMultiSkuModal,
  selectProdQuantity,
} from "../../cart/reducer/cartSlice";

const SUBSCRIBE_UPDATE_PERIOD_HOUR = 2;
const EXPRESS_PROD_COUNT = 6;
const initialState = {
  initFetchCount: 3000,
  prodsAll: [],
  expressProds: [],
  getStatus: "idle",
  scanStatus: "idle",
  errMsg: "",
  prodsShow: [],
  prodsMultiCode: [],
  isAddNewProd: false,
  newProdCode: "",
  curSearchCode: "",
  lastUpdateTime: Date.now(),
  // updatePeriod: 5000,
  updatePeriod: SUBSCRIBE_UPDATE_PERIOD_HOUR * 60 * 60 * 1000,
  updateStatus: "idle",
  updateMessage: "",
};

const SORT_QUERY = "&sortKey=codeLen&sortVal=1";
const PRODSSHOW_MAX_LENGTH = 10;

export const searchProdScanned = createAsyncThunk(
  "prodStorage/searchProdScanned",
  async ({ code }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!code) throw new Error("No Prod code");
      // console.log("search scanned");
      const payload = {
        serverProds: [],
        isAddNewProd: false,
        newProdCode: code,
      };
      const allow_codeDuplicate =
        getState().auth.userInfo.Shop.allow_codeDuplicate;
      const prodsAll = getState().prodStorage.prodsAll;
      //* -------- search local
      let prodToCart;
      let prodsToCart = [];
      let needServer = true;
      let missingMatches = [];
      //find first exact match
      prodToCart = prodsAll.find(
        (prod) => prod.code?.toUpperCase() === code?.toUpperCase()
      );
      let matches = prodToCart?.codeMatchs;
      //find sibling matches
      if (matches?.length > 1) {
        matches.forEach((obj) => {
          const prodTemp = prodsAll.find((prod) => prod._id === obj._id);
          if (prodTemp) prodsToCart.push(prodTemp);
          else missingMatches.push(obj._id);
        });
      }
      // found exact match && no more missing
      if (prodToCart && missingMatches.length === 0) needServer = false;

      //! test 2nd way
      // if (allow_codeDuplicate) {
      // } else {
      //   prodToCart = prodsAll.find((prod) => (prod.code = code));
      //   if (!prodToCart) {
      //   } //search server
      //   if (prodToCart) {
      //   } //add to cart
      // }
      //! end test
      //* ----- search server
      // when no exact match or have missing matches
      if (needServer) {
        const prodRes = await fetch_Prom(
          `${fetchObjs.api}?populateObjs=${JSON.stringify(populateObjs)}${
            // different query based on allow_codeDuplicate
            allow_codeDuplicate
              ? `&includes=${missingMatches}`
              : `&search=${code}`
          }`
        );
        if (prodRes.status === 200) {
          if (prodRes.data.object && !allow_codeDuplicate) {
            payload.serverProds = [prodRes.data.object];
            prodToCart = prodRes.data.object;
          } else if (prodRes.data.objects?.length > 0) {
            //add missing matches
            prodsToCart = [...prodsToCart, ...prodRes.data.objects];
            payload.serverProds = prodRes.data.objects;
          }
        } else throw new Error("Fetch Error");
      }
      //* process
      //has prod
      if (prodToCart) {
        // single prod
        if (prodsToCart.length <= 1) {
          if (!prodToCart.is_simple) {
            dispatch(openMultiSkuModal({ open: true, prodToCart }));
          } else {
            const quantity = selectProdQuantity(prodToCart._id)(getState());
            if (quantity === 0) dispatch(cartItemPost({ prod: prodToCart }));
            else
              dispatch(
                cartItemPut({
                  prodId: prodToCart._id,
                  quantity: quantity + 1,
                })
              );
          }
        }
        //multiple codes prods
        else if (prodsToCart.length > 1) {
          console.log(prodsToCart);
          payload.prodsMultiCode = prodsToCart;
        }
      }
      //no prod
      else {
        console.log("no prod");
        payload.isAddNewProd = true;
      }
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const searchProdCode = createAsyncThunk(
  "prodStorage/searchProdCode",
  async ({ code }, { getState, rejectWithValue, dispatch }) => {
    try {
      console.log("search code", code);
      if (!code) throw new Error("no code provide");
      dispatch(setCurSearchCode(code));
      const allow_codeDuplicate =
        getState().auth.userInfo.Shop?.allow_codeDuplicate;
      const allow_Supplier = getState().auth.userInfo.Shop.allow_Supplier;
      const prodsAll = getState().prodStorage.prodsAll;
      let prodsShow = [];
      const result = {
        prodsShow,
        newProds: [],
        code,
        allow_Supplier,
        // exactMatch: false,
      };
      // * single code
      if (!allow_codeDuplicate) {
        let exactMatch;
        for (let i = 0; i < prodsAll.length; i++) {
          if (exactMatch && prodsShow.length > PRODSSHOW_MAX_LENGTH) break;

          const prod = prodsAll[i];
          //exact
          if (prod.code?.toUpperCase() === code.toUpperCase()) {
            exactMatch = prod;
            prodsShow.unshift({ ...prod, exactMatched: true });
            // result.exactMatch = true;
          }
          //blur
          else if (prod.code?.toUpperCase()?.includes(code.toUpperCase())) {
            prodsShow.push(prod);
          }
        }

        if (!exactMatch) {
          const prodRes = await fetch_Prom(
            `${fetchObjs.api}?populateObjs=${JSON.stringify(
              populateObjs
            )}&search=${code}`
          );
          if (prodRes.status === 200 && prodRes.data.object) {
            prodsShow.unshift({ ...prodRes.data.object, exactMatched: true });
            result.newProds.push(prodRes.data.object);
            result.exactMatch = true;
          }
        }

        return result;
      }

      //* multi codes
      //find exact local
      let firstMatch = prodsAll.find(
        (prod) => prod.code?.toUpperCase() === code?.toUpperCase()
      );
      //find exact server
      if (!firstMatch) {
        const prodRes = await fetch_Prom(
          `${fetchObjs.api}?populateObjs=${JSON.stringify(
            populateObjs
          )}&search=${code}`
        );
        if (prodRes.status === 200) {
          if (prodRes.data.object) {
            firstMatch = prodRes.data.object;
          } else {
            const firstObj = prodRes.data.objects[0];
            if (firstObj?.code?.toUpperCase() === code?.toUpperCase()) {
              firstMatch = firstObj;
              result.newProds.push(firstObj);
            }
          }
        }
      }
      console.log(1111, firstMatch);
      //find matches and missing matches
      const missingMatches = [];
      let matches = [];
      if (firstMatch) {
        result.exactMatch = true;
        matches = firstMatch.codeMatchs;
        if (matches?.length > 1) {
          matches.forEach((obj) => {
            const prodTemp = prodsAll.find((prod) => prod._id === obj._id);
            if (prodTemp) prodsShow.push({ ...prodTemp, exactMatched: true });
            else missingMatches.push(obj._id);
          });
        } else {
          prodsShow.push({ ...firstMatch, exactMatched: true });
        }
      }
      console.log(matches);
      //find missing matches
      if (missingMatches.length > 0) {
        const matchRes = await fetch_Prom(
          `${fetchObjs.api}?populateObjs=${JSON.stringify(
            populateObjs
          )}&includes=${missingMatches}`
        );
        if (matchRes.status === 200) {
          prodsShow = [
            ...prodsShow,
            ...matchRes.data.objects?.map((prod) => ({
              ...prod,
              exactMatched: true,
            })),
          ];
          result.newProds = [...result.newProds, ...matchRes.data.objects];
        }
      }

      let needBlurCount = PRODSSHOW_MAX_LENGTH - prodsShow.length;

      //find blur local
      if (needBlurCount > 0) {
        for (let i = 0; i < prodsAll.length; i++) {
          //base
          if (needBlurCount === 0) break;
          const prod = prodsAll[i];
          const upProdCode = prod.code?.toUpperCase();
          const upSearchCode = code?.toUpperCase();
          if (
            upProdCode.includes(upSearchCode) &&
            upProdCode !== upSearchCode
          ) {
            needBlurCount--;
            prodsShow.push(prod);
          }
        }
      }
      return result;
      // return {
      //   prodsShow,
      //   newProds: serverProds,
      //   newProdCode: matchedProd ? "" : codeFlag || code,
      //   matchExactCodes,
      // };
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProds = createAsyncThunk(
  "prodStorage/fetchProds",
  async (isReload = true, { getState, rejectWithValue }) => {
    const prodsRes = await fetch_Prom(
      `${fetchObjs.api}?populateObjs=${JSON.stringify(populateObjs)}&pagesize=${
        getState().prodStorage.initFetchCount
      }${SORT_QUERY}`
    );
    const expressRes = await fetch_Prom(
      `${fetchObjs.api}?populateObjs=${JSON.stringify(
        populateObjs
      )}&pagesize=${EXPRESS_PROD_COUNT}&is_quick=true`
    );
    // console.log(prodsRes);
    // console.log(expressRes);
    if (prodsRes.status === 200 && expressRes.status === 200)
      return {
        objects: prodsRes.data.objects,
        express: expressRes.data.objects,
        isReload,
      };
    else return rejectWithValue(prodsRes.message);
  }
);

export const resetProdsShow = createAsyncThunk(
  "prodStorage/resetProdsShow",
  (foo = true, { getState, rejectWithValue }) => {
    try {
      // console.log("reset prods show");
      const allow_codeDuplicate =
        getState().auth.userInfo.Shop?.allow_codeDuplicate;
      const supplierId = getState().cart.curCart.subject?._id;
      const isPurchase = getState().cart.curCart.type === 1;
      const prodsAll = getState().prodStorage.prodsAll;
      const newProdsShow = [];
      for (let i = 0; i < prodsAll?.length; i++) {
        if (newProdsShow.length === PRODSSHOW_MAX_LENGTH)
          return { newProdsShow };
        const curProd = prodsAll[i];
        if (isPurchase && allow_codeDuplicate) {
          if (curProd.Supplier && curProd.Supplier !== supplierId) continue;
        }
        // console.log(111111111111, curProd);
        newProdsShow.push(curProd);
      }
      return { newProdsShow };
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.msg);
    }
  }
);

export const fetchProdsUpdate = createAsyncThunk(
  "prodStorage/fetchProdsUpdate",
  async (isReload = false, { getState, dispatch }) => {
    try {
      // console.log(1111111111111, isReload);
      const returnValue = {
        lastUpdateTime: Date.now(),
        modifiedProds: null,
        deletedProdIds: null,
        isModified: false,
      };
      const timeStamp = getState().prodStorage.lastUpdateTime;
      // console.log(timeStamp);
      if (!timeStamp) return returnValue;
      const checkRes = await axios_Prom(`/modifyProds?timestamp=${timeStamp}`);
      console.log("check modify prods", checkRes);
      if (checkRes.status === 200) {
        const { is_modify, mProds, dProds } = checkRes.data;
        if (!is_modify) return returnValue;
        //check cart
        dispatch(handleModifyProds({ mProds, dProds }));
        if (isReload) dispatch(fetchProds());
        else {
          //fetch modified prods
          let modifiedProds = [];
          if (mProds?.length > 0) {
            const prodsRes = await axios_Prom(
              `/prods?includes=${mProds}&populateObjs=${JSON.stringify(
                populateObjs
              )}`
            );
            console.log("get modify prods", prodsRes);
            if (prodsRes.status === 200) {
              modifiedProds = prodsRes.data.objects;
            }
          }
          returnValue.deletedProdIds = dProds;
          returnValue.modifiedProds = modifiedProds;
        }
      }
      returnValue.isModified = true;
      return returnValue;
    } catch (err) {
      console.log(err);
    }
  }
);

export const prodStorageSlice = createSlice({
  name: "prodStorage",
  initialState,
  reducers: {
    setCurSearchCode: (state, action) => {
      state.curSearchCode = action.payload;
    },
    resetProdsMultiCode: (state, action) => {
      state.prodsMultiCode = [];
    },
    setIsAddNewProd: (state, action) => {
      const { open, code } = action.payload;
      if (open === false) state.newProdCode = "";
      else if (code) state.newProdCode = code;
      state.isAddNewProd = open;
    },
    updateProdStorage: (state, action) => {
      try {
        const prods = action.payload;
        if (!prods.length > 0) throw new Error("prods invalid", prods);
        //later need sort when inserting
        prods.forEach((prod) => {
          state.prodsAll.push(prod);
        });
      } catch (err) {
        console.log(err);
      }
    },
    updateLastUpdateTime: (state, action) => {
      state.lastUpdateTime = Date.now();
    },
    resetUpdateStatus: (state, action) => {
      state.updateStatus = "idle";
    },
  },
  extraReducers: {
    [fetchProds.pending]: (state) => {
      state.getStatus = "loading";
    },
    [fetchProds.fulfilled]: (state, action) => {
      state.getStatus = "succeed";
      const { objects, express, isReload } = action.payload;

      //prods all
      if (isReload) state.prodsAll = objects;
      else state.prodsAll = [...state.prodsAll, ...objects];
      //prods express
      state.expressProds = express;
      // state.prodsShow = getProdsShow(state);
      resetProdsShow();
    },
    [fetchProds.rejected]: (state, action) => {
      state.getStatus = "error";
      state.errMsg = action.payload;
    },
    [resetProdsShow.pending]: (state, action) => {},
    [resetProdsShow.fulfilled]: (state, action) => {
      const { newProdsShow } = action.payload;
      // console.log(action.payload);
      if (newProdsShow) state.prodsShow = [];
      // if (newProdsShow) state.prodsShow = newProdsShow;
      state.newProdCode = "";
    },
    [resetProdsShow.rejected]: (state, action) => {},
    [searchProdScanned.pending]: (state) => {
      state.scanStatus = "loading";
    },
    [searchProdScanned.fulfilled]: (state, action) => {
      state.scanStatus = "succeed";
      const { serverProds, isAddNewProd, newProdCode, prodsMultiCode } =
        action.payload;
      //add to local
      if (serverProds) state.prodsAll = [...serverProds, ...state.prodsAll];
      // if (foundLocalProd || serverProd) state.prodsShow = getProdsShow(state);
      if (prodsMultiCode?.length > 0) state.prodsMultiCode = prodsMultiCode;
      if (isAddNewProd) {
        state.isAddNewProd = true;
        state.newProdCode = newProdCode;
      }
    },
    [searchProdScanned.rejected]: (state, action) => {
      state.scanStatus = "error";
      state.errMsg = action.payload;
    },
    [searchProdCode.pending]: (state) => {
      state.scanStatus = "loading";
    },
    [searchProdCode.fulfilled]: (state, action) => {
      state.scanStatus = "succeed";
      const { prodsShow, newProds, code, exactMatch, allow_Supplier } =
        action.payload;
      if (code !== state.curSearchCode) return;
      if (allow_Supplier)
        state.prodsShow = prodsShow?.map((prod) => {
          const supplier = prod.Supplier?.code;
          if (supplier)
            return { ...prod, codeSup: prod.code + ` - ${supplier}` };
          else return prod;
        });
      else state.prodsShow = prodsShow;
      state.newProdCode = code;
    },
    [searchProdCode.rejected]: (state, action) => {
      state.scanStatus = "error";
      state.errMsg = action.payload;
    },
    [fetchProdsUpdate.pending]: (state) => {
      state.updateStatus = "loading";
    },
    [fetchProdsUpdate.fulfilled]: (state, action) => {
      try {
        // console.log("fetchProdsUpdate fulfilled", action.payload);
        const {
          lastUpdateTime,
          deletedProdIds: dpTemp,
          modifiedProds: mpTemp,
          isModified,
        } = action.payload;
        if (lastUpdateTime) state.lastUpdateTime = lastUpdateTime;
        if (!isModified) {
          state.updateStatus = "succeed";
          state.updateMessage = "已经是最新商品库";
          return;
        }

        const deletedProdIds = dpTemp && dpTemp.length > 0 ? [...dpTemp] : [];
        const modifiedProds = mpTemp && mpTemp.length > 0 ? [...mpTemp] : [];
        // console.log(200, deletedProdIds, modifiedProds);

        let indexToDelete = [];
        for (let i = 0; i < state.prodsAll.length; i++) {
          //stop loop when no more delete or modify
          if (
            deletedProdIds.length === indexToDelete.length &&
            modifiedProds.length === 0
          )
            break;
          const prod = state.prodsAll[i];
          //*add index to delete array in reverse order for later use
          if (
            deletedProdIds?.length > 0 &&
            deletedProdIds.indexOf(prod._id) !== -1
          ) {
            // console.log("delete", prod.code);
            //reverse order
            indexToDelete.unshift(i);
            continue;
          }
          //* handle modified prods
          if (modifiedProds?.length > 0) {
            let foundIndex = null;
            const prodFoundInModify = modifiedProds.find((item, index) => {
              if (item._id === prod._id) {
                // console.log("modify", prod.code);
                foundIndex = index;
                return true;
              }
              return false;
            });

            if (prodFoundInModify && foundIndex) {
              state.prodsAll.splice(foundIndex, 1, prodFoundInModify);
              modifiedProds.splice(foundIndex, 1);
            }
          }
        }
        //* handle delete given in reverse order, to not changing the index before delete
        indexToDelete.forEach((index) => {
          state.prodsAll.splice(index, 1);
        });
        //* handle add new prods
        modifiedProds.forEach((prod) => {
          // console.log("add new", index, prod);
          state.prodsAll.unshift(prod);
        });
        state.updateStatus = "succeed";
        state.updateMessage = "更新完成";
      } catch (err) {
        console.log(err);
      }
    },
  },
});

export const {
  setIsAddNewProd,
  updateProdStorage,
  updateLastUpdateTime,
  resetUpdateStatus,
  resetProdsMultiCode,
  setCurSearchCode,
} = prodStorageSlice.actions;
export default prodStorageSlice.reducer;
