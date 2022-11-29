import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch_Prom } from "../../../api/api";
import { fetchObjs, populateObjs } from "../../../config/module/prod/prodConf";

import {
  cartItemPost,
  cartItemPut,
  openMultiSkuModal,
  selectProdQuantity,
} from "../../cart/reducer/cartSlice";

const initialState = {
  initFetchCount: 200,
  prodsAll: [],
  getStatus: "idle",
  scanStatus: "idle",
  errMsg: "",
  prodsShow: [],
  isAddNewProd: false,
  newProdCode: "",
};

export const searchProdScanned = createAsyncThunk(
  "prodStorage/searchProdScanned",
  async ({ code }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!code) throw new Error("No Prod code");
      console.log("search scanned");
      const payload = {
        foundLocalProd: false,
        serverProd: null,
        isAddNewProd: false,
        newProdCode: code,
      };
      const prods = getState().prodStorage.prodsAll;
      //init prod
      let prodToAdd;
      //search local
      for (let i = 0; i < prods.length; i++) {
        const prod = prods[i];
        if (prod.code === code) {
          prodToAdd = prod;
          payload.foundLocalProd = true;
        }
      }
      //search server
      if (!prodToAdd) {
        const prodRes = await fetch_Prom(
          `${fetchObjs.api}?populateObjs=${JSON.stringify(
            populateObjs
          )}&search=${code}`
        );
        if (prodRes.status === 200) {
          if (prodRes.data.object) {
            payload.serverProd = prodRes.data.object;
            prodToAdd = prodRes.data.object;
          }
        } else throw new Error("Fetch Error");
      }
      // found prod and add
      if (prodToAdd) {
        if (!prodToAdd.is_simple) {
          dispatch(openMultiSkuModal({ open: true, prodToAdd }));
        } else {
          const quantity = selectProdQuantity(prodToAdd._id)(getState());
          if (quantity === 0) dispatch(cartItemPost({ prod: prodToAdd }));
          else
            dispatch(
              cartItemPut({
                prodId: prodToAdd._id,
                quantity: quantity + 1,
              })
            );
        }
        return payload;
      } else {
        payload.isAddNewProd = true;
        return payload;
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const searchProdCode = createAsyncThunk(
  "prodStorage/searchProdCode",
  async ({ code }, { getState, rejectWithValue }) => {
    try {
      console.log("search code");
      if (!code) throw new Error("no code provide");
      const prodsAll = getState().prodStorage.prodsAll;
      const prodsShow = [];
      const localIds = [];
      let exactMatch = false;
      //search local
      for (let i = 0; i < prodsAll.length; i++) {
        if (prodsShow.length === 30) return prodsShow;
        const prod = prodsAll[i];
        //match part of
        if (prod.code.toUpperCase()?.includes(code.toUpperCase())) {
          localIds.push(prod._id);
          //match exact
          if (prod.code.toUpperCase() === code.toUpperCase()) {
            exactMatch = true;
            prodsShow.unshift(prod);
          } else prodsShow.push(prod);
        }
      }

      //search server
      const pageSize = 30 - localIds.length;
      const searchQuery = `search=${code}&excludes=${localIds}&pagesize=${
        pageSize > 0 ? pageSize : 1
      }`;
      const prodsRes = await fetch_Prom(
        `${fetchObjs.api}?populateObjs=${JSON.stringify(
          populateObjs
        )}&${searchQuery}`
      );
      if (prodsRes.status === 200) {
        let exactServerProd;
        let newServerProds = [];
        const serverProds = prodsRes.data.objects;
        serverProds.forEach((prod) => {
          if (prod.code === code) {
            exactServerProd = prod;
            exactMatch = true;
          } else newServerProds.push(prod);
        });
        //add exact to 1st
        if (exactServerProd) prodsShow.unshift(exactServerProd);
        return {
          prodsShow: [...prodsShow, ...newServerProds],
          newProds: serverProds,
          newProdCode: exactMatch ? "" : code,
        };
      } else throw new Error("fetch search prods error");
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);
export const fetchProds = createAsyncThunk(
  "prodStorage/fetchProds",
  async (isReload = false, { getState, rejectWithValue }) => {
    const prodsRes = await fetch_Prom(
      `${fetchObjs.api}?populateObjs=${JSON.stringify(populateObjs)}&pagesize=${
        getState().prodStorage.initFetchCount
      }`
    );
    console.log(prodsRes);
    if (prodsRes.status === 200)
      return { objects: prodsRes.data.objects, isReload };
    else return rejectWithValue(prodsRes.message);
  }
);

export const prodStorageSlice = createSlice({
  name: "prodStorage",
  initialState,
  reducers: {
    resetProdShow: (state, action) => {
      if (state.prodsAll?.length > 0) {
        state.prodsShow = state.prodsAll.slice(0, 30) || [];
      }
      state.newProdCode = "";
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
        prods.forEach((prod) => {
          state.prodsAll.unshift(prod);
        });
        state.prodsShow = state.prodsAll.slice(0, 30) || [];
      } catch (err) {
        console.log(err);
      }
    },
  },
  extraReducers: {
    [fetchProds.pending]: (state) => {
      state.getStatus = "loading";
    },
    [fetchProds.fulfilled]: (state, action) => {
      state.getStatus = "succeed";
      const { objects, isReload } = action.payload;
      if (isReload) state.prodsAll = objects;
      else state.prodsAll = [...state.prodsAll, ...objects];

      state.prodsShow = objects.slice(0, 30);
    },
    [fetchProds.rejected]: (state, action) => {
      state.getStatus = "error";
      state.errMsg = action.payload;
    },
    [searchProdScanned.pending]: (state) => {
      state.scanStatus = "loading";
    },
    [searchProdScanned.fulfilled]: (state, action) => {
      state.scanStatus = "succeed";
      const { foundLocalProd, serverProd, isAddNewProd, newProdCode } =
        action.payload;
      if (serverProd) state.prodsAll.unshift(serverProd);
      if (foundLocalProd || serverProd)
        state.prodsShow = state.prodsAll.slice(0, 30);
      if (isAddNewProd) {
        state.isAddNewProd = true;
        state.newProdCode = newProdCode;
      }
      // const { existProd, addNewProd, newProd, needUpdateProd, isAddNewProd } =
      //   action.payload;
      // state.addNewProd = addNewProd;
      // state.existProd = existProd;
      // state.isAddNewProd = isAddNewProd;
      // if (newProd && needUpdateProd) {
      //   state.needUpdateProd = needUpdateProd;
      //   state.prodsAll.push(newProd);
      //   state.prodsShow = [newProd];
      // }
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
      const { prodsShow, newProds, newProdCode } = action.payload;
      if (newProds && newProds.length > 0)
        state.prodsAll = [...state.prodsAll, ...newProds];
      if (prodsShow && prodsShow.length >= 0) state.prodsShow = prodsShow;
      state.newProdCode = newProdCode;
    },
    [searchProdCode.rejected]: (state, action) => {
      state.scanStatus = "error";
      state.errMsg = action.payload;
    },
  },
});

export const { resetProdShow, setIsAddNewProd, updateProdStorage } =
  prodStorageSlice.actions;
export default prodStorageSlice.reducer;
