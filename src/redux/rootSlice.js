import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import navigations from "../config/general/navi/naviConf";

const initialState = {
  view: "PC", //PC||MB
  tabIndex: 0,
  section: "back",
  navis: {
    back: {
      title: "后台管理",
      logo: "",
      btnLabel: "收银",
      navs: navigations.backNav,
    },
  },
  settings: localStorage.getItem("settings")
    ? JSON.parse(localStorage.getItem("settings"))
    : {},
};

export const fetchImgToXs = createAsyncThunk(
  "root/fetchImgToXs",
  async (foo = true, { getState }) => {
    try {
      const prodsAll = getState().prodStorage.prodsAll;
      const DNS = getState().auth.DNS;
      const { byCode, allCodes } = prodsAll || {};
      console.log(byCode, allCodes);
      for (let i = 0; i < 2; i++) {
        // for (let i = 0; i < allCodes.length; i++) {
        const code = allCodes[i];
        const img_url = DNS + byCode[code]?.img_url;
        fetch(img_url, {
          method: "GET",
          // mode: "no-cors",
          headers: {
            "content-type": "application/json",
          },
        })
          .then(async (res) => await res.blob())
          .then((blob) => {
            console.log(blob);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    changeView: (state, action) => {
      state.view = action.payload;
    },
    setTabIndex: (state, action) => {
      state.tabIndex = action.payload;
    },
    setSection: (state, action) => {
      state.section = action.payload;
    },
    changeSettings: (state, action) => {
      try {
        const { field, value } = action.payload;
        console.log(111111111111, field, value);
        state.settings[field] = value;
      } catch (err) {
        console.log(err);
      }
    },
  },
});

export const { changeView, setTabIndex, setSection, changeSettings } =
  rootSlice.actions;

export default rootSlice.reducer;
