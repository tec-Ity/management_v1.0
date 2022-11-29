import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch_Prom } from "../../api/api";

const initialState = {
  analysisData: [],
  fetchStatus: "idle",
};

export const fetchAnalysis = createAsyncThunk(
  "analysis/fetchAnalysis",
  async ({ objs, hasField = false }, { rejectWithValue }) => {
    try {
      let api = "/analys";

      // api += "?" + query.join("&");
      console.log(objs);
      const res = await fetch_Prom(api, "POST", { objs });
      console.log("analys", api, res);
      if (res.status === 200) {
        return { data: res.analys, hasField };
      } else {
        //   alert("faild to load objects", res.message);
        return rejectWithValue(res.message);
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: {
    // [fetchAnalysis.pending]:(state, action)=>{},
    [fetchAnalysis.fulfilled]: (state, action) => {
      const { data } = action.payload;
      if (data) {
        state.analysisData = data;
      }
    },
    // [fetchAnalysis.rejected]:(state, action)=>{},
  },
});

export default analysisSlice.reducer;
