import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { fetch_Prom, axios_Prom } from "../api/api";

const initialState = {
  getStatus: "idle",
  postStatus: "idle",
  putStatus: "idle",
  deleteStatus: "idle",
  batchStatus: "idle",
  errorMsg: "",
};

const useFormData = ["/prod"];

const genQuery = (queryFixedTemp, queryTemp) => {
  try {
    const queryFixed = queryFixedTemp && { ...queryFixedTemp };
    const query = queryTemp && { ...queryTemp };

    //clear duplicate fields in queryFixed
    if (queryFixed && query) {
      let qfKeys = [...Object.keys(queryFixed)];
      qfKeys.forEach((key) => {
        if (query[key]) delete queryFixed[key];
      });
    }

    let queryStr = "?";
    if (queryFixed)
      queryStr += Object.keys(queryFixed)
        .map(
          (key) =>
            `${key}=${
              typeof queryFixed[key] === "string"
                ? queryFixed[key]
                : JSON.stringify(queryFixed[key])
            }`
        )
        .join("&");

    if (query)
      queryStr +=
        "&" +
        Object.keys(query)
          .map(
            (key) =>
              `${key}=${
                typeof query[key] === "string"
                  ? query[key]
                  : JSON.stringify(query[key])
              }`
          )
          .join("&");

    return queryStr;
  } catch (err) {
    console.log(err);
  }
};

export const getObjects = createAsyncThunk(
  "fetch/getObjects",
  async ({ fetchObjs, isReload = true }, { getState, rejectWithValue }) => {
    try {
      const { api: apiBase, flag, query: queryFixed } = fetchObjs;
      const api = apiBase + genQuery(queryFixed, getState().fetch[flag]?.query);
      const res = await fetch_Prom(api);
      console.log("get", flag, api);
      console.log(res);
      if (res.status === 200) {
        return { flag, objects: res.data?.objects, count: res.data?.count };
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

export const getObject = createAsyncThunk(
  "fetch/getObject",
  async ({ fetchObj, id }, { getState, rejectWithValue }) => {
    const {
      flag,
      api: apiBase,
      query: queryFixed,
      parentFlag,
      asField,
    } = fetchObj;
    let api = "";
    if (id) api = apiBase + "/" + id;
    api += genQuery(queryFixed, getState().fetch[flag]?.query);
    console.log("get", flag, api);
    const getRes = await fetch_Prom(api);
    console.log(getRes);
    if (getRes.status === 200)
      return { flag, parentFlag, object: getRes.data.object };
    else return rejectWithValue(getRes.message);
  }
);

export const postObject = createAsyncThunk(
  "fetch/postObject",
  async ({ fetchObj, data }, { getState, rejectWithValue }) => {
    try {
      const {
        flag,
        api: apiBase,
        parentFlag,
        query: queryFixed,
        asField,
        parentField,
      } = fetchObj;
      if (!apiBase || !data) rejectWithValue("No api or data");
      // let data;
      // if (useFormData.includes(apiBase)) data = formData;
      // else data = { obj };
      console.log(data);
      const api = apiBase + genQuery(queryFixed, getState().fetch[flag]?.query);
      console.log(api, data);
      const postRes = await axios_Prom(api, "POST", data);
      console.log(postRes);
      if (postRes.status === 200) {
        return { object: postRes.data.object, ...fetchObj };
      } else {
        //   alert("faild to post objects", postRes.message);
        return rejectWithValue(postRes.message);
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const putObject = createAsyncThunk(
  "fetch/putObject",
  async ({ fetchObj, id, data }, { getState, rejectWithValue }) => {
    try {
      // console.log(22);
      const {
        flag,
        api: apiBase,
        parentFlag,
        query: queryFixed,
        asField,
        // isFieldList,
      } = fetchObj;
      let api = "";
      if (!id) throw new Error("no id");
      api = apiBase + "/" + id;
      api += genQuery(queryFixed, getState().fetch[flag]?.query);
      const putRes = await axios_Prom(api, "PUT", data);
      console.log(putRes);
      if (putRes.status === 200) {
        return { object: putRes.data.object, ...fetchObj };
      } else {
        //   alert("faild to put objects", putRes.message);
        return rejectWithValue(putRes.message);
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

export const deleteObject = createAsyncThunk(
  "fetch/deleteObject",
  async ({ fetchObj, id }, { rejectWithValue }) => {
    const {
      flag,
      api: apiBase,
      parentFlag,
      asField,
      query: queryFixed,
    } = fetchObj;
    let api = apiBase + "/" + id;
    api += genQuery(queryFixed);
    const delRes = await axios_Prom(api, "DELETE");
    console.log(api, delRes, id);
    if (delRes.status === 200) return { flag, parentFlag, id, asField };
    else return rejectWithValue(delRes.message);
  }
);

export const batchObjects = createAsyncThunk(
  "fetch/batchObjects",
  async ({
    fetchObjs,
    method = "GET",
    data,
    selection,
    resDataField = "objects",
    modifiedField,
  }) => {
    const batchFetch = await axios_Prom(fetchObjs.api, method, data);
    console.log(batchFetch, resDataField);
    if (batchFetch.status === 200)
      return {
        data: batchFetch.data[resDataField],
        selection,
        modifiedField,
        ...fetchObjs,
      };
  }
);

export const fetchSlice = createSlice({
  name: "fetch",
  initialState,
  reducers: {
    reSetError: (state, action) => {
      state.errorMsg = "";
    },
    setQuery: (state, action) => {
      try {
        const {
          fetchObjs,
          fetchObj,
          query = {},
          isReload = false,
          isRemove = false,
          isClear = false,
        } = action.payload;
        if (isReload && isRemove) throw new Error("reload and remove conflict");
        if (Object.keys(query).length > 0 || isClear) {
          const flagList = [];
          if (fetchObj?.flag) flagList.push(fetchObj.flag);
          if (fetchObjs?.flag) flagList.push(fetchObjs.flag);
          if (flagList.length === 0)
            throw new Error("No fetchObj or fetchObjs flag provided");

          flagList.forEach((flag) => {
            // console.log(111, isRemove, query);

            if (state[flag]) {
              if (isClear) state[flag].query = {};
              else if (state[flag].query) {
                if (isRemove) {
                  Object.keys(query).forEach(
                    (key) => delete state[flag].query[key]
                  );
                  return;
                } else if (!isReload) {
                  //set page to null if other parameters changed
                  if (!query.page) query.page = null;
                  state[flag].query = { ...state[flag].query, ...query };
                  return;
                }
              } else if (!isRemove) state[flag].query = query;
            } else if (!isRemove) {
              if (isClear) state[flag] = {};
              state[flag] = { query };
            } else throw new Error("No flag to remove query");
          });

          // if (fetchObjs)
          //   state[fetchObjs.flag]
          //     ? (state[fetchObjs.flag].query =
          //         state[fetchObjs.flag].query && !isReload
          //           ? { ...state[fetchObjs.flag].query, ...query }
          //           : query)
          //     : (state[fetchObjs.flag] = { query });
        } else throw new Error("No query");
      } catch (err) {
        console.log(err);
      }
    },
    clearFlagField: (state, action) => {
      try {
        const { flag, field } = action.payload;
        if (!flag) throw new Error("No Flag");
        if (!field) state[flag] = {};
        else if (state[flag]) state[flag][field] = null;
      } catch (err) {
        console.log(err);
      }
    },
  },
  extraReducers: {
    [getObjects.pending]: (state) => {
      state.getStatus = "loading";
    },
    [getObjects.fulfilled]: (state, action) => {
      const { flag, objects, count } = action.payload;
      state.getStatus = "succeed";
      if (!state[flag]) state[flag] = {};
      state[flag].objects = objects;
      state[flag].count = count;
    },
    [getObjects.rejected]: (state, action) => {
      state.getStatus = "error";
      state.errorMsg = action.payload || action.error.message;
    },
    ////////////////////////////////
    [getObject.pending]: (state) => {
      state.getStatus = "loading";
    },
    [getObject.fulfilled]: (state, action) => {
      const { flag, parentFlag, asField, object } = action.payload;
      state.getStatus = "succeed";
      //update parent
      if (!state[parentFlag]) {
        state[parentFlag] = {};
        state[parentFlag].objects = [];
      }
      if (asField) {
        for (let i = 0; i < state[parentFlag].object[asField].length; i++) {
          const item = state[parentFlag].object[asField][i];
          if (item._id === object._id) {
            state[parentFlag].object[asField][i] = object;
            break;
          }
        }
      } else
        for (let i = 0; i < state[parentFlag].objects?.length; i++) {
          // const obj = state[parentFlag].objects[i];
          if (state[parentFlag].objects[i]._id === object._id) {
            state[parentFlag].objects[i] = object;
            break;
          }
        }
      //update self
      if (!state[flag]) state[flag] = {};
      state[flag].object = object;
    },
    [getObject.rejected]: (state, action) => {
      state.getStatus = "error";
      state.errorMsg = action.payload || action.error.message;
    },
    ////////////////////////////////
    [postObject.pending]: (state) => {
      state.postStatus = "loading";
    },
    [postObject.fulfilled]: (state, action) => {
      const { flag, object, parentFlag, asField, parentField } = action.payload;
      state.postStatus = "succeed";
      //init new
      if (!state[parentFlag]) {
        state[parentFlag] = {};
        state[parentFlag].objects = [];
      }
      //update object
      if (asField) {
        if (state[parentFlag]?.object)
          state[parentFlag]?.object[asField]?.unshift(object);
        //update objects
        if (parentField) {
          //get parent id
          let parentId = object[parentField]?._id || object[parentField];
          for (let i = 0; i < state[parentFlag].objects.length; i++) {
            const parent = state[parentFlag].objects[i];
            //found parent
            if (parent._id === parentId) parent[asField]?.unshift(object);
          }
        }
      } else state[parentFlag].objects.unshift(object);
      if (!state[flag]) state[flag] = {};
      state[flag].object = object;
    },
    [postObject.rejected]: (state, action) => {
      state.postStatus = "error";
      state.errorMsg = action.payload || action.error.message;
    },
    ////////////////////////////////
    [putObject.pending]: (state) => {
      state.putStatus = "loading";
    },
    [putObject.fulfilled]: (state, action) => {
      const { object, flag, parentFlag, asField, parentField } = action.payload;
      state.putStatus = "succeed";

      //update parent
      if (!state[parentFlag]) {
        state[parentFlag] = {};
        state[parentFlag].objects = [];
      }
      if (asField) {
        //update object
        if (state[parentFlag].object) {
          for (let i = 0; i < state[parentFlag].object[asField].length; i++) {
            const item = state[parentFlag].object[asField][i];
            if (item._id === object._id) {
              state[parentFlag].object[asField][i] = object;
              break;
            }
          }
        }
        //update objects
        if (parentField && state[parentFlag].objects) {
          const parentId = object[parentField]?._id || object[parentField];
          //find parent
          for (let i = 0; i < state[parentFlag]?.objects.length; i++) {
            const parent = state[parentFlag]?.objects[i];
            if (parent?._id === parentId) {
              //find itself
              for (let j = 0; j < parent[asField].length; j++) {
                const item = parent[asField][j];
                if (item._id === object._id) {
                  parent[asField][j] = object;
                  break;
                }
              }
            }
          }
        }
      } else
        for (let i = 0; i < state[parentFlag].objects?.length; i++) {
          // const obj = state[parentFlag].objects[i];
          if (state[parentFlag].objects[i]._id === object._id) {
            state[parentFlag].objects[i] = object;
            break;
          }
        }
      //update self
      if (!state[flag]) state[flag] = {};
      state[flag].object = object;
    },
    [putObject.rejected]: (state, action) => {
      console.log("put error");
      state.putStatus = "error";
      // console.log(action);
      state.errorMsg = action.payload || action.error.message;
    },
    ////////////////////////////////
    [deleteObject.pending]: (state) => {
      state.deleteStatus = "loading";
    },
    [deleteObject.fulfilled]: (state, action) => {
      try {
        const { id, flag, parentFlag, asField } = action.payload;
        console.log(id, flag, parentFlag, asField);
        state.deleteStatus = "succeed";
        //delete from parent
        if (state[parentFlag]) {
          let objects;
          if (!asField && state[parentFlag]?.objects)
            objects = state[parentFlag].objects;
          else if (asField && state[parentFlag]?.object?.[asField])
            objects = state[parentFlag].object[asField];
          else throw new Error("param error");
          let i = 0;
          for (; i < objects.length; i++) {
            if (objects[i]._id === id) break;
          }
          //found and need to delete
          if (i < objects.length) {
            asField
              ? state[parentFlag].object[asField].splice(i, 1)
              : state[parentFlag].objects.splice(i, 1);
          }
        }
        //delete self
        if (state[flag] && state[flag].object) state[flag] = {};
        //   state[flag].object = object;
      } catch (err) {
        console.log(err);
      }
    },
    [deleteObject.rejected]: (state, action) => {
      state.deleteStatus = "error";
      state.errorMsg = action.payload || action.error.message;
    },
    [batchObjects.pending]: (state) => {
      state.batchStatus = "loading";
    },
    [batchObjects.rejected]: (state) => {
      state.batchStatus = "error";
    },
    [batchObjects.fulfilled]: (state, action) => {
      const { data, selection, flag, modifiedField } = action.payload;
      const { objects } = state[flag];
      console.log(objects);
      if (selection) {
        data?.forEach((obj) => {
          for (let i = 0; i < objects.length; i++) {
            if (objects[i]._id === obj._id)
              if (modifiedField) {
                console.log(11, modifiedField);
                objects[i][modifiedField] = obj[modifiedField];
              } else objects[i] = obj;
          }
        });
      } else state[flag].objects = data;
      state.batchStatus = "succeed";
    },
  },
});

export const { setQuery, clearFlagField, reSetError } = fetchSlice.actions;
export default fetchSlice.reducer;

export const selectObjects = (flag, subField) => (state) => {
  return state.fetch[flag]?.objects
    ? subField
      ? state.fetch[flag].objects?.map((obj) => obj[subField])
      : state.fetch[flag].objects
    : [];
};
export const selectObjectsCount = (flag) => (state) => {
  return state.fetch[flag]?.count ? state.fetch[flag].count : 0;
};

export const selectObject = (flag) => (state) => {
  return state.fetch[flag]?.object ? state.fetch[flag].object : {};
};

export const selectQuery = (flag) => (state) => {
  return state.fetch[flag]?.query ? state.fetch[flag].query : null;
};
