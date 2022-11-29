import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getObjects,
  selectObjects,
  deleteObject,
  clearFlagField,
  setQuery,
} from "../../redux/fetchSlice";

//component
import CusListFrontUI from "../list/CusListFrontUI.jsx";
import DetailFrontUI from "../detail/DetailFrontUI.jsx";
//mui
import { Grid, Typography, Box } from "@mui/material";
import SearchComp from "../search/SearchComp";
import CusDialog from "../modal/CusDialog";

export default function CusPageFront({
  fetchObjs,
  fetchObj,
  CardUI,
  DetailCardUI,
  Filters,
  showSearch = true,
  showSearchBorder,
  SearchParamSelector,
  extraHeaderContentFront,
  listTitle,
  listNoneMsg,
  detailTitle,
  listCol,
  listMaxWidth = 527,
  buttons,
  customSearch,
  busType,
  initObjects,
  initFetch = true,
  // mergeInitObejcts
}) {
  const plainFetchObjs = JSON.stringify(fetchObjs);
  // console.log(111, plainFetchObjs);
  const dispatch = useDispatch();
  const objects = useSelector(
    selectObjects(fetchObjs.flag, fetchObjs.subField)
  );
  const view = useSelector((state) => state.root.view);
  const getStatus = useSelector((state) => state.fetch.getStatus);
  const [curObjId, setCurObjId] = useState();
  const deleteStatus = useSelector((state) => state.fetch.deleteStatus);
  const [deleted, setDeleted] = React.useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const isMB = view === "MB";

  const borderStyle = {
    borderColor: `${busType}Mid.main`,
  };

  // console.log(111111, initObjects);
  const onDelete = (id) => {
    dispatch(deleteObject({ fetchObj, id }));
    setDeleted(true);
  };

  useEffect(() => {
    console.log(1111111111, "cusPageFront fetch");
    fetchObjs &&
      !customSearch &&
      initFetch &&
      getStatus !== "loading" &&
      dispatch(getObjects({ fetchObjs }));
  }, [customSearch, dispatch, plainFetchObjs, initFetch]);

  useEffect(() => {
    if (deleted && deleteStatus === "succeed") {
      setDeleted(false);
      setCurObjId(null);
    }
  }, [deleteStatus, deleted]);

  useEffect(() => {
    return () => {
      console.log("unmount cusPageFront");
      dispatch(clearFlagField({ flag: fetchObj?.flag }));
      dispatch(clearFlagField({ flag: fetchObjs?.flag }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const curObj = initObjects
    ? initObjects.find((obj) => obj._id === curObjId)
    : objects.find((obj) => obj._id === curObjId);

  return (
    <Grid container justifyContent="center">
      {/* list */}
      <Grid
        container
        item
        xs={12}
        md={6}
        // xl={6}
        sx={{
          maxWidth: "600px !important",
          height: "100%",
          "&>div": { px: !isMB && "20px" },
        }}
        alignContent="flex-start"
      >
        {/* header */}
        <Grid
          item
          container
          sx={{
            height: Filters ? { xs: 120, md: 130 } : 70,
            mt: { xs: 1, md: 2 },
            maxWidth: 600,
          }}
          alignContent="flex-start"
        >
          {!isMB && listTitle && (
            <Grid container item xs={12} md={3} alignItems="center">
              <Typography
                sx={{ fontWeight: 700, fontSize: 26 }}
                color="custom.primary"
              >
                {listTitle}
              </Typography>
            </Grid>
          )}
          {showSearch && (
            <>
              <Grid
                container
                item
                xs={SearchParamSelector ? 6 : 12}
                md={SearchParamSelector ? (listTitle ? 5 : 7) : 9}
                alignItems="center"
                sx={{ maxWidth: 527 }}
              >
                {customSearch ? (
                  customSearch
                ) : (
                  <SearchComp
                    // allowKeyboard={}
                    fetchObjs={fetchObjs}
                    realTime
                    onChangeCB={() => setRefreshIndex((prev) => prev + 1)}
                    style={showSearchBorder ? borderStyle : {}}
                  />
                )}
              </Grid>
            </>
          )}
          {SearchParamSelector && (
            <Grid
              container
              item
              xs={5}
              md={listTitle ? 4 : 5}
              // xl={4}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ "&>div": { pl: 1 } }}
            >
              {SearchParamSelector && SearchParamSelector}
            </Grid>
          )}
          {/* {Filters && (
            <Grid
              container
              item
              xs={12}
              // justifyContent="flex-end"
              sx={{ height: 80 }}
            > */}
          {extraHeaderContentFront && (
            <Grid item sx={{ width: "fit-content", pr: 2 }}>
              {extraHeaderContentFront}
            </Grid>
          )}
          {Filters?.map((Filter, index) => (
            <Grid item sx={{ pt: 1, pl: 1 }} key={Filter.name + index}>
              <Filter
                key={Filter.name + index + refreshIndex}
                fetchObjs={fetchObjs}
                busType={busType}
              />
            </Grid>
          ))}
        </Grid>
        {/* )}
        </Grid> */}
        <CusListFrontUI
          busType={busType}
          isMB={isMB}
          objects={
            initFetch
              ? initObjects
                ? [...initObjects, ...objects]
                : objects
              : initObjects
          }
          fetchObjs={fetchObjs}
          selObjId={curObjId}
          handleCardClick={(id) => setCurObjId(id)}
          status={getStatus}
          CardUI={CardUI}
          col={listCol}
          noneMsg={listNoneMsg || "暂无信息"}
          onPageStateChange={({ page, pageSize }) => {
            dispatch(
              setQuery({
                fetchObjs,
                query: { page: page + 1, pagesize: pageSize },
              })
            );
          }}
        />
      </Grid>
      {/* detail */}

      {isMB ? (
        <CusDialog
          open={Boolean(curObjId)}
          onClose={() => setCurObjId(null)}
          fullScreen
          content={
            <DetailFrontUI
              obj={curObj}
              DetailCardUI={DetailCardUI}
              detailTitle={detailTitle}
              buttons={buttons}
              onDelete={onDelete}
            />
          }
        />
      ) : (
        <Grid
          container
          item
          xs={12}
          md={6}
          sx={{ boxSizing: "border-box", px: 5, "&>div": { maxWidth: 567 } }}
          justifyContent="flex-end"
        >
          {
            <DetailFrontUI
              obj={curObj}
              DetailCardUI={DetailCardUI}
              detailTitle={detailTitle}
              buttons={buttons}
              onDelete={onDelete}
            />
          }
        </Grid>
      )}
    </Grid>
  );
}
