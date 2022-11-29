import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios_Prom, refreshToken_Prom } from "../api/api";
import { loginUrl, logoutUrl } from "../config/general/router/routerConf";
const initialState = {
  isLogin: Boolean(localStorage.getItem("accessToken")),
  DNS: localStorage.getItem("DNS"),
  DnsStatus: "idle",
  loginStatus: "idle",
  logoutStatus: "idle",
  errMsg: "",
  // showLoginModal: false,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") || "")
    : {},
};

export const fetchDNS = createAsyncThunk(
  "auth/fetchDNS",
  async (foo = true, { rejectWithValue }) => {
    const DNS = localStorage.getItem("DNS");
    if (!DNS) {
      return rejectWithValue("no dns");
    }
    return DNS;
  }
);

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (system, { getState, rejectWithValue }) => {
    try {
      const DNS =
        getState().auth.DNS?.substring(0, 4)?.toLowerCase() === "http"
          ? getState().auth.DNS
          : system.DNS;
      console.log(DNS);
      if (!DNS || DNS.substring(0, 4)?.toLowerCase() !== "http")
        throw new Error("DNS ERROR");
      localStorage.setItem("DNS", DNS);
      const loginRes = await axios_Prom("/login", "POST", { system }, DNS);
      console.log(loginRes);
      if (loginRes.status === 200) {
        if (loginRes.data?.payload?.role === 100)
          return rejectWithValue("Invalid Account Type (print)");
        localStorage.setItem("refreshToken", loginRes.data.refreshToken);
        localStorage.setItem("accessToken", loginRes.data.accessToken);
        const shopRes = await axios_Prom(
          `/shop/${
            loginRes.data.payload.Shop._id || loginRes.data.payload.Shop
          }`
        );
        if (shopRes.status === 200) {
          let userInfo = {
            ...loginRes.data.payload,
            Shop: shopRes.data.object,
          };
          return {
            userInfo,
            DNS,
          };
        }
      } else {
        //   alert("faild to post objects", loginRes.message);
        return rejectWithValue(loginRes.message);
      }
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.message);
    }
  }
);

export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (system, { getState, rejectWithValue }) => {
    try {
      const refreshedData = await refreshToken_Prom();
      console.log(1111, refreshedData);
      localStorage.setItem("refreshToken", refreshedData.data.refreshToken);
      localStorage.setItem("accessToken", refreshedData.data.accessToken);
      if (refreshedData.status === 200) {
        const shopRes = await axios_Prom(
          `/shop/${
            refreshedData.data.payload.Shop._id ||
            refreshedData.data.payload.Shop
          }`
        );
        console.log(shopRes);
        if (shopRes.status === 200) {
          let userInfo = {
            ...refreshedData.data.payload,
            Shop: shopRes.data.object,
          };
          return { userInfo };
        }
      } else {
        return rejectWithValue(refreshedData.status);
      }
    } catch (e) {
      return rejectWithValue();
    }
  }
);

// export const fetchLogout = createAsyncThunk(
//   "auth/fetchLogout",
//   async (foo = 1, { getState, rejectWithValue }) => {
//     // const logoutRes = await fetch_Prom("/logout", "DELETE");
//     // console.log(logoutRes);
//     // if (logoutRes.status === 200) {
//     // localStorage.removeItem("refreshToken");
//     // localStorage.removeItem("accessToken");
//     localStorage.clear();

//     return {};
//     // } else {
//     //   //   alert("faild to post objects", logoutRes.message);
//     //   return rejectWithValue(logoutRes.message);
//     // }
//   }
// );

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setDNS: (state, action) => {
      state.DNS = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    updateUserInfo: (state, action) => {
      const { field, value } = action.payload;
      // const userInfo = state.userInfo;
      state.userInfo[field] = value;
    },
    handleLogout: (state) => {
      state.isLogin = false;
      state.userInfo = {};
    },
  },
  extraReducers: {
    [fetchDNS.pending]: (state, action) => {
      state.DnsStatus = "loading";
    },
    [fetchDNS.fulfilled]: (state, action) => {
      state.DnsStatus = "succeed";
    },
    [fetchDNS.rejected]: (state, action) => {
      state.DnsStatus = "error";
    },
    [fetchLogin.pending]: (state) => {
      state.loginStatus = "loading";
    },
    [fetchLogin.fulfilled]: (state, action) => {
      const { userInfo, DNS } = action.payload;
      state.loginStatus = "succeed";
      state.isLogin = true;
      state.userInfo = userInfo;
      state.DNS = DNS;
    },
    [fetchLogin.rejected]: (state, action) => {
      state.loginStatus = "error";
      state.errMsg = action.payload;
    },
    [fetchUserInfo.pending]: (state) => {
      state.fetchUserInfoStatus = "loading";
    },
    [fetchUserInfo.fulfilled]: (state, action) => {
      state.fetchUserInfoStatus = "succeed";
      const { userInfo } = action.payload;
      state.userInfo = userInfo;
    },
    [fetchUserInfo.rejected]: (state, action) => {
      state.fetchUserInfoStatus = "error";
    },
    // [fetchLogout.pending]: (state) => {
    //   state.logoutStatus = "loading";
    // },
    // [fetchLogout.fulfilled]: (state, action) => {
    //   state.logoutStatus = "succeed";
    //   state.userinfo = {};
    //   state.isLogin = false;
    // },
    // [fetchLogout.rejected]: (state, action) => {
    //   state.logoutStatus = "error";
    //   state.errMsg = action.error.message;
    // },
  },
});

export const { setDNS, setIsLogin, updateUserInfo, handleLogout } =
  authSlice.actions;

export default authSlice.reducer;
