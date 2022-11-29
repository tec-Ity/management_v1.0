import { Grid, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "../../../component/search/SearchInput";
import ProdRow from "../prodComp/ProdRow";
import { setIsAddNewProd } from "../../_prodStorage/reducer/ProdStorageSlice";
import CusAddButton from "../../../component/button/CusAddButton";
import CusImgViewModal from "../../../component/modal/CusImgViewModal";
import CusDialog from "../../../component/modal/CusDialog";
import ProdInfo from "./ProdInfo";

export default function ProdList({
  busType,
  type,
  handleSearchProd,
  handleAddProd,
  prodsShow,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
  handleClickMulti,
  searchFocus,
  onSearchFocus,
  searchAutoFocus,
  isMB = false,
  curCart = {},
}) {
  const dispatch = useDispatch();
  const newProdCode = useSelector((state) => state.prodStorage.newProdCode);
  // const { totItem, goodsPrice, OrderProds } = curCart;
  // const totType = OrderProds?.length;
  const [selectedImageUrl, setSelectedImageUrl] = useState([]);
  const [selectedProd, setSelectedProd] = useState(null);
  // const ua = window.navigator.userAgent.toLocaleLowerCase();
  // const isIOS = /iphone|ipad/.test(ua);
  const [showInfoModal, setShowInfoModal] = useState(false);
  return (
    <>
      <Grid
        container
        item
        alignContent="flex-start"
        xs={12}
        md={4}
        sx={{ height: "100%", order: 1 }}
      >
        {/* search */}
        <Grid
          container
          item
          xs={12}
          sx={{
            height: { xs: 60, md: 85 },
            bgcolor: "custom.gray",
            position: "relative",
            zIndex: 9,
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={12}>
            <SearchInput
              handleChange={(value, select) => {
                setSelectedProd(null);
                handleSearchProd(value, select);
              }}
              handleKeyDown={handleAddProd}
              focus={searchFocus}
              onFocus={onSearchFocus}
              // numOnly
              numOnly={isMB}
              busType={busType}
              // autoFocus={searchAutoFocus}
              debounceTimeout={0}
            />
          </Grid>
        </Grid>
        {/* prods list */}
        <Grid
          container
          xs={12}
          item
          justifyContent="space-between"
          sx={{
            // mx: { xs: -1, md: -4 },
            // px: { xs: 1, md: 4 },
            // pt: { xs: 1, md: 0 },
            overflowY: "scroll",
            position: "relative",
            maxHeight: "calc(100vh - 155px)",
            // width: { xs: "calc(100% + 16px)", md: "calc(100% + 64px)" },
            "&::-webkit-scrollbar": { display: "none" },
            // order: { xs: 1, md: 2 },
          }}
        >
          {newProdCode && (!selectedProd || !isMB) && (
            <Grid
              item
              xs={12}
              sx={{
                pb: { xs: 1, md: 2 },
                //  order: 1
              }}
            >
              <CusAddButton
                busType={busType}
                handleClick={() => dispatch(setIsAddNewProd({ open: true }))}
              />
            </Grid>
          )}
          {prodsShow?.length === 0 ? (
            <Grid item xs={12}>
              <Typography>暂无产品，搜索或添加新产品。</Typography>
            </Grid>
          ) : selectedProd && isMB ? (
            <>
              <ProdRow
                focused
                exactMatched={selectedProd.exactMatched}
                busType={busType}
                type={type}
                prod={selectedProd}
                handleItemPost={handleItemPost}
                handleItemPut={handleItemPut}
                handleItemDelete={handleItemDelete}
                handleClickMulti={handleClickMulti}
                handleImgClick={() => setSelectedImageUrl(selectedProd.img_url)}
                handleShowInfo={() => {
                  setSelectedProd(selectedProd);
                  setShowInfoModal(true);
                }}
              />
              {/* <Paper sx={{ m: 1, p: 2, borderRadius: "10px" }}>
                <ProdInfo prod={selectedProd} />
              </Paper> */}
            </>
          ) : (
            prodsShow.map((prod, index) => (
              <Grid
                container
                item
                xs={12}
                key={prod._id + index}
                sx={{
                  pb: { xs: 1, md: 2 },
                }}
              >
                {/* {console.log(prod)} */}
                <ProdRow
                  exactMatched={prod.exactMatched}
                  busType={busType}
                  type={type}
                  prod={prod}
                  handleItemPost={handleItemPost}
                  handleItemPut={handleItemPut}
                  handleItemDelete={handleItemDelete}
                  handleClickMulti={handleClickMulti}
                  handleImgClick={() => setSelectedImageUrl(prod.img_url)}
                  handleShowInfo={() => {
                    setSelectedProd(prod);
                    !isMB && setShowInfoModal(true);
                  }}
                />
              </Grid>
              // <Grid item md={6} xl={4} key={prod._id} sx={{ pb: 2 }}>
              //   <ProdCard
              //     prod={prod}
              //     handleItemPost={handleItemPost}
              //     handleItemPut={handleItemPut}
              //     handleItemDelete={handleItemDelete}
              //     handleClickMulti={handleClickMulti}
              //   />
              // </Grid>
            ))
          )}
        </Grid>
      </Grid>
      <CusImgViewModal
        open={selectedImageUrl?.length > 0}
        onClose={() => setSelectedImageUrl(null)}
        img_url={selectedImageUrl}
      />
      <CusDialog
        fullScreen={isMB}
        open={showInfoModal}
        onClose={() => {
          setShowInfoModal(false);
        }}
        title="产品详情"
        content={selectedProd && <ProdInfo prod={selectedProd} />}
      />
    </>
  );
}
