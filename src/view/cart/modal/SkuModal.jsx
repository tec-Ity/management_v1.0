import { Divider, Grid, Typography } from "@mui/material";
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";
import CusDialog from "../../../component/modal/CusDialog";
import getPrice from "../../../utils/price/getPrice";
import ProdControl from "../prodComp/ProdControl";
import { selectSkuQuantity } from "../reducer/cartSlice";

export default function SkuModal({
  open,
  onClose,
  prod,
  skus,
  type,
  handleItemPut,
  handleItemPost,
  handleItemDelete,
}) {
  return (
    <CusDialog
      open={open}
      onClose={onClose}
      size="xs"
      title="选择规格商品"
      dividers
      sx={{ overflowX: "hidden" }}
      content={
        <MultiSkuSelect
          type={type}
          prod={prod}
          multiSkus={skus}
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
        />
      }
      actions={[
        {
          label: t("general.confirm"),
          onClick: onClose,
        },
      ]}
    />
  );
}

const MultiSkuSelect = ({
  type,
  prod,
  multiSkus,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
}) => {
  // console.log(prod);
  return (
    <Grid container rowSpacing={1} sx={{ overflowX: "hidden" }}>
      {multiSkus?.map((sku) => (
        <SkuRow
          type={type}
          key={sku._id}
          prod={prod}
          sku={sku}
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
        />
      ))}
    </Grid>
  );
};

const SkuRow = ({
  type,
  prod,
  sku,
  handleItemPost,
  handleItemPut,
  handleItemDelete,
}) => {
  const quantity = useSelector(selectSkuQuantity(prod._id, sku._id));
  return (
    <Grid container item xs={12} columnSpacing={1}>
      <Grid container item xs={8} md={5} alignItems="center">
        <Typography>
          {sku?.attrs?.map(
            (attr, index) =>
              (index !== 0 ? ", " : "") + attr.nome + ": " + attr.option
          )}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={8}
        md={4}
        alignItems="center"
        sx={{ order: { xs: 3, md: 2 } }}
      >
        <Typography>
          {type === 1
            ? "进价 " + getPrice(sku.price_cost)
            : "卖价 " + getPrice(sku.price_sale)}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={4}
        md={3}
        justifyContent="flex-end"
        alignItems="center"
        sx={{ order: { xs: 2, md: 3 } }}
      >
        <ProdControl
          busType={type === 1 ? "purchase" : "sale"}
          prod={prod}
          quantity={quantity}
          sku={sku}
          isSimple
          size="medium"
          handleItemPost={handleItemPost}
          handleItemPut={handleItemPut}
          handleItemDelete={handleItemDelete}
        />
      </Grid>
      <Grid item xs={12} sx={{ order: 4 }}>
        <Divider />
      </Grid>
    </Grid>
  );
};
