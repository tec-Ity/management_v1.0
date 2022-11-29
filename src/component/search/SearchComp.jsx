import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchInput from "./SearchInput";
import { getObjects, selectQuery, setQuery } from "../../redux/fetchSlice";
export default function SearchComp({
  fetchObjs,
  placeholder,
  query: propsQuery = {},
  style = {
    borderColor: null,
    borderColorHover: null,
    borderColorFocused: null,
  },
  realTime = false,
  onSelect,
  onChangeCB = () => {},
  initFetch = false,
  ...rest
}) {
  const dispatch = useDispatch();
  const getStatus = useSelector((state) => state.fetch.getStatus);
  const query = useSelector(selectQuery(fetchObjs.flag));
  const [selected, setSelected] = React.useState(false);
  const searchParam = useMemo(
    () => fetchObjs.searchParam || "search",
    [fetchObjs.searchParam]
  );

  useEffect(() => {
    // console.log("query", query);
    // console.log("fetchObjs", fetchObjs);
    if (fetchObjs) {
      query && getStatus !== "loading" && dispatch(getObjects({ fetchObjs }));
      onSelect && query && selected && onSelect(query[searchParam]);
    }
  }, [JSON.stringify(fetchObjs), query]);

  useEffect(() => {
    initFetch &&
      fetchObjs &&
      dispatch(
        getObjects({ fetchObjs, query: { ...fetchObjs.query, ...propsQuery } })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchInput
      style={style}
      realTime={realTime}
      clearOnSelect={false}
      placeholder={placeholder}
      handleChange={(code, select) => {
        if (code && select) setSelected(true);
        else setSelected(false);
        //1 no code in search but has previouse search
        //2 has code provided
        if ((!code && query && query[searchParam]) || code)
          dispatch(
            setQuery({
              fetchObjs,
              query: { [searchParam]: code || "", page: 1, ...propsQuery },
            })
          );
        onChangeCB(code, select);
      }}
      {...rest}
    />
  );
}
