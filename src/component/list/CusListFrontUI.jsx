import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Button, Fab, Grid, Typography } from "@mui/material";

import CusCardDS from "../card/CusCardDS";
import CusH6 from "../typography/CusH6";
import CusCard from "../card/CusCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import { useSelector } from "react-redux";
import { selectQuery } from "../../redux/fetchSlice";
import { useRef } from "react";

CusListFrontUI.propTypes = {
  // CardUI: <></>,
  CardUI: PropTypes.func.isRequired,
};

CusListFrontUI.defaultProps = {
  cardType: "DS",
};

const PAGE_SIZE = 30;
const DEFAULT_PAGE_STATE = {
  page: 0,
  pageSize: PAGE_SIZE,
};
export default function CusListFrontUI({
  busType,
  objects,
  selObjId,
  handleCardClick,
  CardUI,
  status,
  noneMsg,
  isMB,
  col = 1,
  back = false, //是否为后台
  onPageStateChange = () => {},
  fetchObjs,
  cardType,
}) {
  const query = useSelector(selectQuery(fetchObjs?.flag));
  const [pageState, setPageState] = React.useState(DEFAULT_PAGE_STATE);
  const ref = useRef(null);
  useEffect(() => {
    /*when query is changed an pagesize is null 
    (set by setQuery, every time query, other than page, changed, clear page by set to null)*/
    //reset page state
    if (isNaN(parseInt(query?.page))) {
      setPageState(DEFAULT_PAGE_STATE);
    }
    ref.current.scrollTop = 0;
  }, [query]);

  // React.useEffect(() => {
  //   // pageState.page !== defaultPageState.page &&
  //   //   pageState.pageSize !== defaultPageState.pageSize &&
  //   onPageStateChange && onPageStateChange(pageState);
  //   // return () => console.log(1111111111);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pageState]);

  const CardComp = cardType === "basic" ? CusCard : CusCardDS;
  return (
    <>
      <Grid
        ref={ref}
        item
        container
        xs={12}
        rowGap={isMB ? 1 : 2.5}
        columnGap={2}
        sx={{
          maxHeight: `calc(100vh - ${back ? 150 : 215}px)`,
          paddingBottom: "min(100px, 90px)",
          paddingTop: !back && "10px",
          // justifyContent: "space-between",
          alignContent: "flex-start",
          overflowY: "scroll",
          "&::msOverflowStyle": "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          scrollBehavior: "smooth",
        }}
      >
        {objects?.length > 0
          ? objects.map((obj) => {
              return (
                obj && (
                  <Grid container item key={obj._id} xs={12}>
                    <CardComp
                      busType={busType}
                      selected={selObjId && selObjId === obj._id}
                      onClick={() => handleCardClick(obj._id)}
                      isMB={isMB}
                    >
                      <CardUI obj={obj} isMB={isMB} />
                    </CardComp>
                  </Grid>
                )
              );
            })
          : status === "succeed" && <CusH6 type={busType}>{noneMsg}</CusH6>}
        {!(pageState.page === 0 && objects.length < PAGE_SIZE) && (
          <Grid
            container
            item
            xs={12}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              disabled={pageState.page === 0}
              onClick={() => {
                onPageStateChange({ ...pageState, page: pageState.page - 1 });
                setPageState((prev) => ({ ...prev, page: prev.page - 1 }));
              }}
            >
              <ChevronLeftIcon />
              上一页
            </Button>
            <Typography sx={{ mx: 2 }}>第{pageState.page + 1}页</Typography>
            <Button
              disabled={objects.length < PAGE_SIZE}
              onClick={() => {
                onPageStateChange({ ...pageState, page: pageState.page + 1 });
                setPageState((prev) => ({ ...prev, page: prev.page + 1 }));
              }}
            >
              下一页
              <ChevronRightIcon />
            </Button>
          </Grid>
        )}
      </Grid>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: { xs: 10, md: "" },
          left: { md: 10 },
        }}
        onClick={() => (ref.current.scrollTop = 0)}
      >
        <VerticalAlignTopIcon />
      </Fab>
    </>
  );
}
