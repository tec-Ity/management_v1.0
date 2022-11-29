import { Divider, Grid } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CusDialog from "../../../component/modal/CusDialog";
import { resetProdsMultiCode } from "../../_prodStorage/reducer/ProdStorageSlice";
import ProdRow from "../prodComp/ProdRow";

export default function ProdMultiCodesList({
  busType,
  type,
  handleItemPut,
  handleItemDelete,
  handleItemPost,
  handleClickMulti,
}) {
  const dispatch = useDispatch();
  const prodsMultiCode = useSelector(
    (state) => state.prodStorage.prodsMultiCode
  );
  const onClose = () => dispatch(resetProdsMultiCode());
  return (
    <CusDialog
      size="sm"
      open={prodsMultiCode?.length > 1}
      onClose={onClose}
      title="请选择商品"
      showCloseIcon={false}
      content={
        <Grid container rowSpacing={1} sx={{ p: 1 }}>
          {prodsMultiCode?.map((prod) => (
            <Grid item xs={12}>
              <ProdRow
                disableControl
                exactMatched={prod.exactMatched}
                busType={busType}
                type={type}
                prod={prod}
                handleItemPost={handleItemPost}
                handleItemPut={handleItemPut}
                handleItemDelete={handleItemDelete}
                handleClickMulti={handleClickMulti}
                onClick={({ quantity }) => {
                  if (quantity === 0) handleItemPost(prod)();
                  else if (quantity > 0)
                    handleItemPut(prod._id, null, quantity + 1)();
                  onClose();
                }}
                // handleImgClick={() => setSelectedImageUrl(prod.img_url)}
                // handleShowInfo={() => {
                //   setSelectedProd(prod);
                //   !isMB && setShowInfoModal(true);
                // }}
              />
              <Divider />
            </Grid>
          ))}
        </Grid>
      }
    />
  );
}
