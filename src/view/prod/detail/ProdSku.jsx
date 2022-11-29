import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  putObject,
  getObject,
  selectObject,
  deleteObject,
  postObject,
} from "../../../redux/fetchSlice";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import FormInput from "../../../component/form/FormInput";
import AddIcon from "@mui/icons-material/Add";
import CusH6 from "../../../component/typography/CusH6.jsx";
import { useTranslation } from "react-i18next";
import getPrice from "../../../utils/price/getPrice";

export default function ProdSku({ _id, obj: prod }) {
  const dispatch = useDispatch();
  const [showAddNew, setShowAddNew] = useState(false);

  function handlePostSku(attrs, basic) {
    console.log(attrs, basic);
    dispatch(
      postObject({
        fetchObj: { api: "/Sku", parentFlag: "prod", asField: "Skus" },
        data: {
          obj: {
            Prod: _id,
            attrs,
            ...basic,
          },
        },
      })
    );
  }

  function handlePutSku(attrs, basic, id) {
    dispatch(
      putObject({
        fetchObj: { api: "/Sku", parentFlag: "prod", asField: "Skus" },
        id,
        data: {
          general: { attrs, ...basic },
        },
      })
    );
  }

  return (
    <>
      {showAddNew ? (
        <SkuRow
          isNew
          Attrs={prod.Attrs}
          handleSubmit={handlePostSku}
          handleCancel={() => setShowAddNew(false)}
          sku={{
            price_sale: prod.price_sale,
            price_regular: prod.price_regular,
            price_cost: prod.price_cost,
          }}
        />
      ) : (
        <Grid item xs={12} sx={{ py: 2 }}>
          <Button onClick={() => setShowAddNew(true)} variant="contained">
            <AddIcon />
            新增多规格商品
          </Button>
        </Grid>
      )}
      {prod?.Skus?.map((sku, index) => (
        <SkuRow
          key={sku._id}
          index={index}
          Attrs={prod.Attrs}
          sku={sku}
          handleSubmit={handlePutSku}
          handleDelete={() =>
            dispatch(
              deleteObject({
                fetchObj: {
                  api: `/Sku`,
                  parentFlag: "prod",
                  asField: "Skus",
                },
                id: sku._id,
              })
            )
          }
        />
      ))}
    </>
  );
}

const SkuRow = ({
  isNew,
  Attrs,
  index,
  sku,
  handleSubmit,
  handleCancel = () => {},
  handleDelete,
}) => {
  const { t } = useTranslation();
  console.log(sku);
  const [newSkuAttrs, setNewSkuAttrs] = useState({});
  const [newSkuBasic, setNewSkuBasic] = useState({});
  const [modifying, setModifying] = useState(false);
  //set default value for put
  useEffect(() => {
    if (sku) {
      if (!isNew) {
        sku.attrs?.forEach((attr) => {
          setNewSkuAttrs((prev) => ({ ...prev, [attr.nome]: attr.option }));
        });
        const basic = { ...sku };
        delete basic.attrs;
        delete basic._id;
        setNewSkuBasic(basic);
      } else setNewSkuBasic(sku);
    }
  }, [isNew, sku]);

  const handleSubmitSelf = (e) => {
    e.preventDefault();
    const attrs = [];
    for (const key in newSkuAttrs) {
      if (Object.hasOwnProperty.call(newSkuAttrs, key)) {
        const attr = newSkuAttrs[key];
        attr && attrs.push({ nome: key, option: attr });
      }
    }
    handleSubmit(attrs, newSkuBasic, sku?._id);
  };
  return (
    <Card elevation={5} sx={{ p: { xs: 1, md: 2 }, my: 2 }}>
      <Grid
        container
        item
        xs={12}
        component="form"
        rowSpacing={1}
        onSubmit={handleSubmitSelf}
      >
        <Grid item xs={12}>
          <CusH6>
            {isNew ? "新增多规格商品" : "多规格商品 " + (index + 1)}
          </CusH6>
        </Grid>
        {!modifying && !isNew && (
          <Grid item xs={12}>
            <Typography>
              {sku?.attrs?.map((attr) => (
                <Fragment
                  key={attr.option}
                >{`${attr.nome}: ${attr.option} / `}</Fragment>
              ))}
            </Typography>
            <Typography>
              {[
                { nome: "卖价", value: sku.price_sale },
                { nome: "标价", value: sku.price_regular },
                { nome: "进价", value: sku.price_cost },
              ].map((item) => (
                <Fragment key={item.nome}>
                  {`${item.nome}: ${getPrice(item.value)}`}
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                </Fragment>
              ))}
            </Typography>
            <Typography>库存 {sku?.quantity}</Typography>
          </Grid>
        )}
        <Collapse
          in={isNew || modifying}
          timeout="auto"
          unmountOnExit
          sx={{ width: "100%" }}
        >
          <CardContent>
            <Grid container item xs={12} rowSpacing={2}>
              <Grid container item xs={12} columnSpacing={1}>
                {Attrs?.map((attr) => (
                  <Grid item xs={12} md={3} key={attr.nome} sx={{ pt: 1 }}>
                    <FormInput
                      type="select"
                      label={attr.nome}
                      value={newSkuAttrs[attr.nome] || ""}
                      options={attr.options?.map((op) => ({
                        label: op,
                        value: op,
                      }))}
                      handleChange={(value) =>
                        setNewSkuAttrs((prev) => ({
                          ...prev,
                          [attr.nome]: value,
                        }))
                      }
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid container item xs={12} columnSpacing={1}>
                <Grid item xs={12} md={2} sx={{ pt: 1 }}>
                  <FormInput
                    type="price"
                    label="标价"
                    value={newSkuBasic.price_regular || ""}
                    handleChange={(value) =>
                      setNewSkuBasic((prev) => ({
                        ...prev,
                        price_regular: value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ pt: 1 }}>
                  <FormInput
                    type="price"
                    label="卖价"
                    value={newSkuBasic.price_sale || ""}
                    handleChange={(value) =>
                      setNewSkuBasic((prev) => ({ ...prev, price_sale: value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ pt: 1 }}>
                  <FormInput
                    type="price"
                    label="进价"
                    value={newSkuBasic.price_cost || ""}
                    handleChange={(value) =>
                      setNewSkuBasic((prev) => ({ ...prev, price_cost: value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ pt: 1 }}>
                  <FormInput
                    type="text"
                    label="库存"
                    value={newSkuBasic.quantity || ""}
                    handleChange={(value) =>
                      setNewSkuBasic((prev) => ({ ...prev, quantity: value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2} sx={{ pt: 1 }}>
                  <FormInput
                    type="text"
                    endAdornment="KG"
                    label="重量"
                    value={newSkuBasic.weight || ""}
                    handleChange={(value) =>
                      setNewSkuBasic((prev) => ({ ...prev, weight: value }))
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>

        {(isNew || modifying) && (
          <>
            <Grid container item xs={3} md={1.5} alignItems="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  !isNew && setModifying(false);
                  handleCancel();
                }}
              >
                {t("general.cancel")}
              </Button>
            </Grid>
            {!isNew && (
              <Grid item xs={3} md={1.5} container alignItems="flex-end">
                <Button variant="outlined" color="error" onClick={handleDelete}>
                  {t("general.delete")}
                </Button>
              </Grid>
            )}
            <Grid container item xs={3} md={1.5} alignItems="flex-end">
              <Button type="submit" variant="contained">
                {t("general.submit")}
              </Button>
            </Grid>
          </>
        )}
        {!isNew && !modifying && (
          <Grid container item xs={12} md={1.5} alignItems="flex-end">
            <Button variant="outlined" onClick={() => setModifying(true)}>
              {t("general.modify")}
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};
