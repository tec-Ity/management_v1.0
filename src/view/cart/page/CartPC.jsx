import React from "react";
import { Box, Grid } from "@mui/material";
import ProdList from "../prodList/ProdList.jsx";
import DetailFrontUI from "../../../component/detail/DetailFrontUI.jsx";
import CusH6 from "../../../component/typography/CusH6.jsx";
import CartList from "../cartList/CartList.jsx";
import CartListMax from "../cartList/CartListMax.jsx";
import PaymentDetail from "../paymentDetail/PaymentDetail.jsx";
import Input from "../../../component/input/Input.jsx";

export default function CartPC({
  busType,
  type,
  curCart,
  handleSearchProd,
  handleAddProd,
  prodsShow,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
  handleClickMulti,
  searchFocus,
  onSearchFocus,
  buttons,
  showVirtual,
}) {
  return (
    <Grid
      container
      sx={{ height: "100%", px: 3 }}
      justifyContent="space-between"
      columnSpacing={type === 1 ? 1 : 1}
    >
      {/*  prodsShow section & search //////////////*/}
      {type === 1 && (
        <ProdList
          busType={busType}
          type={type}
          handleSearchProd={handleSearchProd}
          handleAddProd={handleAddProd}
          prodsShow={prodsShow}
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
          handleClickMulti={handleClickMulti}
          searchFocus={searchFocus}
          onSearchFocus={onSearchFocus}
        />
      )}
      {/*  cart list section  */}
      <Grid
        container
        item
        xs={type === 1 ? 5 : 9}
        sx={{ height: "100%", order: 2 }}
        justifyContent="center"
      >
        {type === 1 ? (
          //////////////////cartlist/////////////////
          <DetailFrontUI
            maxWidth="lg"
            obj={{}}
            detailTitle={
              curCart?.subject && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    pl: 2,
                  }}
                >
                  <CusH6 type={busType}>
                    {type === 1 ? "供应商" : "会员"}:
                  </CusH6>
                  <CusH6 type={busType}>{curCart.subject.code}</CusH6>
                  <CusH6 type={busType}>{curCart.subject.nome}</CusH6>
                </Box>
              )
            }
            DetailCardUI={() => (
              <CartList
                busType={busType}
                fullWidth={false}
                curCart={curCart}
                handleItemPut={handleItemPut}
                handleItemDelete={handleItemDelete}
              />
            )}
          />
        ) : (
          //////////////////cartlist max/////////////////
          <CartListMax
            busType={busType}
            curCart={curCart}
            handleSearchProd={handleSearchProd}
            handleAddProd={handleAddProd}
            prodsShow={prodsShow}
            handleItemPost={handleItemPost}
            handleItemPut={handleItemPut}
            handleItemDelete={handleItemDelete}
            handleClickMulti={handleClickMulti}
            searchFocus={searchFocus}
            onSearchFocus={onSearchFocus}
          />
        )}
      </Grid>
      {/*  payment ////////////////// */}
      <Grid
        container
        item
        xs={3}
        sx={{ height: "100%", order: { xs: -1, md: 3 } }}
        justifyContent="center"
      >
        <DetailFrontUI
          obj={{}}
          detailTitle={" "}
          buttons={buttons}
          DetailCardUI={() => (
            <PaymentDetail
              showDetail
              showChange
              busType={busType}
              curCart={curCart}
              type={type}
              showVirtual={showVirtual}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
