import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteObject, postObject, putObject } from "../../../redux/fetchSlice";

import { Button, Grid } from "@mui/material";
import FormInput from "../../../component/form/FormInput";
import AddIcon from "@mui/icons-material/Add";
import CusH6 from "../../../component/typography/CusH6.jsx";
import { useTranslation } from "react-i18next";

export default function ProdAttr({ _id, prod }) {
  const dispatch = useDispatch();
  const [showAddAttr, setShowAddAttr] = useState(false);
  const postStatus = useSelector((state) => state.fetch.postStatus);
  const [submitted, setSubmitted] = useState(false);

  function handlePostAttr(attr) {
    console.log(attr);
    dispatch(
      postObject({
        fetchObj: { api: "/Attr", parentFlag: "prod", asField: "Attrs" },
        data: { obj: { Prod: _id, ...attr } },
      })
    );
    setSubmitted(true);
  }

  function handlePutAttr(
    id,
    nameModified, //string || null
    optionsModified, //obj {option:optionPut}
    optionsPost, //array
    optionsDeleted //array
  ) {
    console.log(
      1111,
      nameModified,
      optionsModified,
      optionsPost,
      optionsDeleted
    );
    const formData = new FormData();
    //name
    if (nameModified) formData.append("general", { nome: nameModified });
    //put
    if (Object.keys(optionsModified).length > 0) {
      let optionPuts = [];
      for (const key in optionsModified) {
        if (Object.hasOwnProperty.call(optionsModified, key)) {
          const value = optionsModified[key];
          optionPuts.push({ option: key, optionPut: value });
        }
      }
      formData.append("optionPuts", optionPuts);
    }
    //post
    if (optionsPost.length > 0)
      formData.append("optionPost", { options: optionsPost.join(",") });
    //delete
    if (optionsDeleted.length > 0)
      formData.append("optionDelete", { options: optionsDeleted });

    dispatch(
      putObject({
        fetchObj: { api: "/Attr", parentFlag: "prod", asField: "Attrs" },
        id,
        data: { formData },
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
  /*
  [
    {
        "options": [
            "红",
            "黄",
            "蓝",
            "绿"
        ],
        "_id": "62bc2199c0291dff670b33c8",
        "nome": "颜色"
    },
    {
        "options": [
            "XS",
            "S",
            "MD",
            "LG"
        ],
        "_id": "62bc21abc0291dff670b33cd",
        "nome": "大小"
    }
]
  */
  return (
    <>
      <Grid container item xs={12}>
        {showAddAttr ? (
          <>
            <Grid item xs={12}>
              <CusH6>新增属性</CusH6>
            </Grid>
            <NewAttrRow
              handleSubmit={handlePostAttr}
              handleCancel={handleCancel}
            />
          </>
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
          handleSubmit={handlePutAttr}
          handleAttrDelete={() => handleAttrDelete(attr._id)}
        />
      ))}
    </>
  );
}

const ModifyAttrRow = ({ attr, handleSubmit, handleAttrDelete }) => {
  const { t } = useTranslation();
  const [modifying, setModifying] = useState(false);
  const [attrUpdate, setAttrUpdate] = useState(attr);
  const [optionsModified, setOptionsModified] = useState({});
  const [optionsPost, setOptionsPost] = useState([]);
  const [optionNew, setOptionNew] = useState("");
  const [optionsDeleted, setOptionsDeleted] = useState([]);
  const [warning, setWarning] = useState("");

  console.log(
    attrUpdate,
    optionsModified,
    optionsPost,
    optionNew,
    optionsDeleted,
    warning
  );

  const handleSubmitSelf = () => {
    handleSubmit(
      attr._id,
      attr.nome === attrUpdate.nome ? attrUpdate.nome : null,
      optionsModified,
      optionsPost,
      optionsDeleted
    );
  };

  const handleCancelSelf = () => {
    setModifying(false);
  };

  const handleOptionModified = (option, value) => {
    setOptionsModified((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleOptionDelete = (option) => {
    //update attrUpdate
    setAttrUpdate((prev) => {
      let findIndex = prev.options.indexOf(option);
      if (findIndex !== -1) {
        //found option needs to be deleted
        let newOptions = [...prev.options]; //copy
        newOptions.splice(findIndex, 1); //remove option
        return { ...prev, options: newOptions };
      } else return prev; //if not found return original
    });
    // update modified list
    if (optionsModified[option]) {
      setOptionsModified((prev) => {
        const newOptionsModified = { ...prev };
        delete newOptionsModified[option];
        return newOptionsModified;
      });
    }
    //update delete list
    if (optionsDeleted.indexOf(option) === -1) {
      optionsDeleted.push(option);
    }
  };

  const handleAddNewOption = () => {
    try {
      if (!optionNew) return;
      if (typeof optionNew !== "string") throw new Error("option not string");
      if (attrUpdate.options.indexOf(optionNew) === -1) {
        //if currently not exist, then push
        setAttrUpdate((prev) => ({
          ...prev,
          options: [...prev.options, optionNew],
        }));
        //only if original attr does not have this option, then add to the post list
        if (attr.options.indexOf(optionNew) === -1)
          setOptionsPost((prev) => [...prev, optionNew]);
        //check if previously deleted
        let delIndex = optionsDeleted.indexOf(optionNew);
        if (delIndex !== -1) {
          //remove option in delete list
          setOptionsDeleted((prev) => {
            let newDeletList = [...prev];
            return newDeletList.splice(delIndex, 1);
          });
        }
      } else {
        setWarning(optionNew + "已存在");
        return;
      }
      setOptionNew("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container item xs={12} spacing={1} sx={{ pb: 1 }}>
      {/* name */}
      <Grid item xs={4} md={4}>
        <FormInput
          type="text"
          label="Attr Name"
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
          <Grid item xs={4} md={1} container alignItems="flex-end">
            <Button onClick={handleCancelSelf} variant="outlined">
              {t("general.cancel")}
            </Button>
          </Grid>
          <Grid item xs={4} md={1} container alignItems="flex-end">
            <Button onClick={handleAttrDelete} variant="outlined" color="error">
              {t("general.delete")}
            </Button>
          </Grid>
          <Grid item xs={4} md={1} container alignItems="flex-end">
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
        <Grid item xs={2} md={1} container alignItems="flex-end">
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
            <Grid container item xs={6} md={4} key={option + index}>
              <Grid item xs={6}>
                <FormInput
                  type="text"
                  label={"选项" + (index + 1)}
                  value={optionsModified[option] ?? option}
                  handleChange={(value) => handleOptionModified(option, value)}
                  disabled={optionsPost.indexOf(option) !== -1}
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
                  color="error"
                  onClick={() => handleOptionDelete(option)}
                >
                  {t("general.delete")}
                </Button>
              </Grid>
            </Grid>
          ))}
          <Grid container item xs={6} md={4}>
            <Grid item xs={6}>
              <FormInput
                type="text"
                label={"new"}
                value={optionNew}
                handleChange={(value) => setOptionNew(value)}
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
                onClick={handleAddNewOption}
              >
                {t("general.confirm")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        // options
        <Grid item xs={12} md={4}>
          <FormInput
            type="text"
            label="options"
            value={attr.options?.join(",")}
            disabled={!modifying}
            // handleChange={(value) =>
            //   setUpdAttr((prev) => ({ ...prev, options: value }))
            // }
          />
        </Grid>
      )}
    </Grid>
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
          label="Attr Name"
          value={newAttr.nome}
          handleChange={handleChange("nome")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormInput
          type="text"
          label="options"
          value={newAttr.options}
          handleChange={handleChange("options")}
          placeholder="option1 , option2 , option3 , ..."
        />
      </Grid>
      <Grid item xs={2} md={1} container alignItems="flex-end">
        <Button onClick={handleCancel} variant="outlined">
          CANCEL
        </Button>
      </Grid>
      <Grid item xs={2} md={1} container alignItems="flex-end">
        <Button type="submit" variant="contained">
          SUBMIT
        </Button>
      </Grid>
    </Grid>
  );
};
