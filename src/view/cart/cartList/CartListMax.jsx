import { Box, ClickAwayListener, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import CartList from "./CartList";
import DropSearch from "../../../component/search/DropSearch.jsx";
import { useSelector } from "react-redux";
import getPrice from "../../../utils/price/getPrice";

import ExpressProdComp from "./component/ExpressProdComp";
export default function CartListMax({
  busType,
  handleSearchProd,
  handleAddProd,
  searchFocus,
  onSearchFocus,
  prodsShow,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
  handleClickMulti,
  curCart,
}) {
  const DNS = useSelector((state) => state.auth.DNS);
  const isExpressProd = true;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        pt: 2,
      }}
    >
      <Grid container sx={{ height: 70 }}>
        <ClickAwayListener onClickAway={() => {}}>
          <Box sx={{ position: "relative", width: "100%" }}>
            {/* <SearchInput
              handleChange={handleSearchProd}
              handleKeyDown={handleAddProd}
              focus={searchFocus}
              onFocus={onSearchFocus}
            /> */}
            <DropSearch
              allowKeyboard
              isSimple
              objects={prodsShow}
              handleChange={handleSearchProd}
              handleKeyDown={handleAddProd}
              focus={searchFocus}
              onFocus={onSearchFocus}
              itemRowHeight={80}
              CusItemRow={({ obj: prod }) => (
                <Box
                  sx={{
                    boxSizing: "border-box",
                    display: "flex",
                    width: "100%",
                    p: 1,
                  }}
                >
                  {prod.img_xs && (
                    <Box
                      component="img"
                      src={DNS + prod.img_xs}
                      sx={{
                        display: "block",
                        height: 50,
                        width: 50,
                        objectFit: "scale-down",
                      }}
                    />
                  )}
                  <Box sx={{ width: "60%", pl: 2 }}>
                    <Typography noWrap>{prod.nome}</Typography>
                    <Typography noWrap>{prod.nomeTR}</Typography>
                    <Typography noWrap>{prod.code}</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Typography noWrap>{getPrice(prod.price_sale)}</Typography>
                  </Box>
                </Box>
              )}
              onSelect={(prod) =>
                prod.is_simple
                  ? handleItemPost(prod)()
                  : handleClickMulti(prod)()
              }
            />
          </Box>
        </ClickAwayListener>
      </Grid>
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          position: "relative",
          boxSizing: "border-box",
          bgcolor: "custom.whiteLight",
          borderRadius: "10px",
          p: 2,
          maxHeight: "calc(100vh - 170px)",
          height: "100%",
          overflowY: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <CartList
          busType={busType}
          curCart={curCart}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
        />
      </Paper>
      {isExpressProd && (
        <ExpressProdComp
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
        />
      )}
    </Box>
  );
}
