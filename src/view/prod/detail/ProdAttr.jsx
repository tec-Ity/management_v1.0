import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteObject, postObject, putObject } from "../../../redux/fetchSlice";

import { Button, Card, Divider, Grid } from "@mui/material";
import FormInput from "../../../component/form/FormInput";
import AddIcon from "@mui/icons-material/Add";
import CusH6 from "../../../component/typography/CusH6.jsx";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import ErrorSnackBar from "../../../component/popover/ErrorSnackBar";

const fetchObj = {
  api: "/Attr",
  parentFlag: "prod",
  asField: "Attrs",
  isFieldList: true,
};

export default function ProdAttr({ _id, obj: prod }) {
  const dispatch = useDispatch();
  const [showAddAttr, setShowAddAttr] = useState(false);
  const postStatus = useSelector((state) => state.fetch.postStatus);
  const [submitted, setSubmitted] = useState(false);

  function handlePostAttr(attr) {
    console.log(attr);

    dispatch(
      postObject({
        fetchObj,
        data: { obj: { Prod: _id, ...attr } },
      })
    );
    setSubmitted(true);
  }

  function handleCancel() {
    setShowAddAttr(false);
  }

  function handleAttrDelete(id) {
    dispatch(
      deleteObject({
        fetchObj: {
          api: `/Attr`,
          parentFlag: "prod",
          asField: "Attrs",
        },
        id,
      })
    );
  }

  useEffect(() => {
    if (submitted && postStatus === "succeed") {
      setShowAddAttr(false);
      setSubmitted(false);
    }
  }, [postStatus, submitted]);
  console.log(prod);
  return (
    <>
      <Grid container item xs={12}>
        {showAddAttr ? (
          <Card elevation={5} sx={{ p: 1, my: 2, width: "100%" }}>
            <Grid item xs={12}>
              <CusH6>新增属性</CusH6>
            </Grid>
            <NewAttrRow
              handleSubmit={handlePostAttr}
              handleCancel={handleCancel}
            />
          </Card>
        ) : (
          <Button
            onClick={() => setShowAddAttr(true)}
            variant="contained"
            sx={{ my: 2 }}
          >
            <AddIcon /> 添加属性
          </Button>
        )}
      </Grid>

      {prod.Attrs?.map((attr) => (
        <ModifyAttrRow
          key={attr._id}
          attr={attr}
          // handleSubmit={handlePutAttr}
          handleAttrDelete={() => handleAttrDelete(attr._id)}
        />
      ))}
    </>
  );
}

const ModifyAttrRow = ({ attr, handleSubmit, handleAttrDelete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modifying, setModifying] = useState(false);
  const [attrUpdate, setAttrUpdate] = useState(attr);
  const [optionsNew, setOptionsNew] = useState("");
  const [error, setError] = useState("");
  const [curModifingOptionIndex, setCurModifingOptionIndex] = useState(null);
  const id = attr._id;
  console.log(attrUpdate);
  //update attr after update from server
  useEffect(() => attr && setAttrUpdate(attr), [attr]);
  const handleSubmitSelf = () => {
    attr.nome !== attrUpdate.nome &&
      dispatch(
        putObject({
          fetchObj,
          id,
          data: { general: { nome: attrUpdate.nome } },
        })
      );
    setModifying(false);
  };

  const handleCancelSelf = () => {
    setModifying(false);
    setAttrUpdate(attr);
  };

  const handleOptionPost = () => {
    if (attrUpdate.options?.indexOf(optionsNew) !== -1)
      setError("重复添加属性");
    else {
      dispatch(
        putObject({
          fetchObj,
          id,
          data: { optionPost: { options: optionsNew } },
        })
      );
      setOptionsNew("");
    }
  };

  const handleOptionModify = (option, optionPut) => {
    console.log(option, optionPut);
    dispatch(
      putObject({
        fetchObj,
        id,
        data: { optionPuts: [{ option, optionPut }] },
      })
    );
  };

  const handleOptionDelete = (option) => {
    dispatch(
      putObject({
        fetchObj,
        id,
        data: { optionDelete: { options: [option] } },
      })
    );
  };

  return (
    <Card elevation={5} sx={{ p: { xs: 1, md: 2 }, my: 2 }}>
      <ErrorSnackBar error={error} onClose={() => setError("")} />
      <Grid container item xs={12} spacing={2} sx={{ pb: 1 }}>
        {/* name */}
        <Grid item xs={4} md={4} sx={{ order: 0 }}>
          <FormInput
            type="text"
            label="属性名称"
            value={attrUpdate.nome ?? attr.nome}
            disabled={!modifying}
            handleChange={(value) =>
              setAttrUpdate((prev) => ({ ...prev, nome: value }))
            }
          />
        </Grid>
        {/* buttons */}
        {modifying ? (
          //three buttons
          <Grid container item xs={8}>
            <Grid item xs={4} md={1.5} container alignItems="flex-end">
              <Button onClick={handleCancelSelf} variant="outlined">
                {t("general.cancel")}
              </Button>
            </Grid>
            <Grid item xs={4} md={1.5} container alignItems="flex-end">
              <Button
                onClick={handleAttrDelete}
                variant="outlined"
                color="error"
              >
                {t("general.delete")}
              </Button>
            </Grid>
            <Grid item xs={4} md={1.5} container alignItems="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={handleSubmitSelf}
              >
                {t("general.submit")}
              </Button>
            </Grid>
          </Grid>
        ) : (
          // modify button
          <Grid
            item
            xs={2}
            md={1}
            container
            alignItems="flex-end"
            sx={{ order: { xs: 2, md: 3 } }}
          >
            <Button
              type="submit"
              variant="outlined"
              onClick={() => setModifying(true)}
            >
              {t("general.modify")}
            </Button>
          </Grid>
        )}
        {modifying ? (
          // option list
          <Grid container item xs={12} rowSpacing={1}>
            {attrUpdate.options?.map((option, index) => (
              <Grid
                container
                item
                xs={12}
                md={4}
                key={option + index}
                columnSpacing={1}
              >
                <OptionRow
                  option={option}
                  index={index}
                  isActive={curModifingOptionIndex === index}
                  setActive={(value) =>
                    setCurModifingOptionIndex((prev) =>
                      //only active when no another active
                      value && !prev ? index : null
                    )
                  }
                  handleOptionModify={handleOptionModify}
                  handleOptionDelete={handleOptionDelete}
                />
              </Grid>
            ))}
            <Grid container item xs={12} md={4}>
              <Grid item xs={6}>
                <FormInput
                  type="text"
                  label="添加新属性"
                  value={optionsNew}
                  placeholder="选项1, 选项2, 选项3, ..."
                  handleChange={(value) => setOptionsNew(value)}
                />
              </Grid>
              <Grid
                container
                item
                xs={6}
                justifyContent="center"
                alignItems="flex-end"
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={handleOptionPost}
                >
                  {t("general.confirm")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          // options
          <Grid item xs={12} md={4} sx={{ order: { xs: 3, md: 2 } }}>
            <FormInput
              type="text"
              label="选项"
              value={attr.options?.join(",")}
              disabled={!modifying}
              // handleChange={(value) =>
              //   setUpdAttr((prev) => ({ ...prev, options: value }))
              // }
            />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

const OptionRow = ({
  option,
  index,
  isActive,
  setActive,
  handleOptionModify,
  handleOptionDelete,
}) => {
  const [optionUpdate, setOptionUpdate] = useState(option);
  // const [modifying, setModifying] = useState(false);

  const handleCancelSelf = () => {
    // setModifying(false);
    setActive(false);
    setOptionUpdate(null);
  };

  return (
    <>
      <Grid item xs={4}>
        <FormInput
          type="text"
          label={"选项" + (index + 1)}
          value={optionUpdate ?? option}
          disabled={!isActive}
          handleChange={(value) => setOptionUpdate(value)}
        />
      </Grid>

      {/* buttons */}
      {isActive ? (
        // {modifying ? (
        //three buttons
        <Grid container item xs={8}>
          <Grid item xs={4} container alignItems="flex-end">
            <Button onClick={handleCancelSelf} variant="outlined">
              {t("general.cancel")}
            </Button>
          </Grid>
          <Grid item xs={4} container alignItems="flex-end">
            <Button
              onClick={() => handleOptionDelete(option)}
              variant="outlined"
              color="error"
            >
              {t("general.delete")}
            </Button>
          </Grid>
          <Grid item xs={4} container alignItems="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="success"
              onClick={() => {
                if (option !== optionUpdate) {
                  handleOptionModify(option, optionUpdate);
                  setOptionUpdate(null);
                  // setModifying(false);
                  setActive(false);
                }
              }}
            >
              {t("general.submit")}
            </Button>
          </Grid>
        </Grid>
      ) : (
        // modify button
        <Grid item xs={2} md={6} container alignItems="flex-end">
          <Button
            type="submit"
            variant="outlined"
            onClick={() => {
              // setModifying(true);
              setActive(true);
            }}
          >
            {t("general.modify")}
          </Button>
        </Grid>
      )}
    </>
  );
};

const NewAttrRow = ({ handleCancel, handleSubmit }) => {
  const [newAttr, setNewAttr] = useState({ nome: "", options: "" });

  const handleChange = (field) => (value) => {
    setNewAttr((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitSelf = (e) => {
    e.preventDefault();
    handleSubmit(newAttr);
  };

  return (
    <Grid
      container
      item
      xs={12}
      spacing={1}
      component="form"
      onSubmit={handleSubmitSelf}
    >
      <Grid item xs={12} md={4}>
        <FormInput
          type="text"
          label="属性名称"
          value={newAttr.nome}
          handleChange={handleChange("nome")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormInput
          type="text"
          label="选项"
          value={newAttr.options}
          handleChange={handleChange("options")}
          placeholder="选项1, 选项2, 选项3, ..."
        />
      </Grid>
      <Grid item xs={3} md={1} container alignItems="flex-end">
        <Button onClick={handleCancel} variant="outlined">
          {t("general.cancel")}
        </Button>
      </Grid>
      <Grid item xs={3} md={1} container alignItems="flex-end">
        <Button type="submit" variant="contained">
          {t("general.submit")}
        </Button>
      </Grid>
    </Grid>
  );
};
