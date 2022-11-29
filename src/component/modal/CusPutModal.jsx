import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
//redux
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  putObject,
  getObject,
  selectObject,
  deleteObject,
  clearFlagField,
  reSetError,
} from "../../redux/fetchSlice";
//component
import CusForm from "../form/CusForm.jsx";
import ErrorSnackBar from "../popover/ErrorSnackBar";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import CusDialog from "./CusDialog";
//utils

//mui

export default function CusPutModal({
  open,
  onClose,
  title = "详情",
  fetchObj,
  formInputs,
  fileInput,
  objectId,
  moreDetails = false,
  actions = [],
  initFetch = false,
  initObject,
  fullScreen,
  justifyAction,
}) {
  //init
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //state
  const [submitted, setSubmitted] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  //selector
  const object = useSelector(selectObject(fetchObj.flag));
  const putStatus = useSelector((state) => state.fetch.putStatus);
  // const getStatus = useSelector((state) => state.fetch.getStatus);
  const deleteStatus = useSelector((state) => state.fetch.deleteStatus);
  const errorMsg = useSelector((state) => state.fetch.errorMsg);

  //effect
  //init object
  useEffect(() => {
    // console.log(getStatus);
    initFetch && dispatch(getObject({ fetchObj, id: objectId }));
    return () => {
      dispatch(clearFlagField({ flag: fetchObj.flag }));
    };
  }, []);

  useEffect(() => {
    if (submitted === true && putStatus === "succeed") {
      setSubmitted(false);
      onClose();
    }
  }, [onClose, putStatus, submitted]);

  useEffect(() => {
    if (deleted === true && deleteStatus === "succeed") {
      setDeleted(false);
      onClose();
    }
  }, [deleteStatus, deleted, onClose]);

  //func
  const handleSubmit = useCallback(
    (formValue) => {
      const formData = new FormData();
      const { image, imageSmall, ...obj } = formValue;

      const newObj = {};
      if (initObject) {
        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            const initVal = initObject[key];
            if (val !== initVal) newObj[key] = val;
          }
        }
      }

      formData.append("obj", JSON.stringify(initObject ? newObj : obj));
      // image?.forEach((img, i) => formData.append("img" + i, img));
      image && formData.append("img_url", image[0]);
      imageSmall && formData.append("img_xs", imageSmall[0]);
      const data = image ? formData : { general: obj };
      // console.log(1111);
      for (const value of formData.values()) {
        console.log(value);
      }
      console.log(222, objectId, fetchObj);

      dispatch(putObject({ fetchObj, data, id: objectId }));
      setSubmitted(true);
    },
    [dispatch, fetchObj, objectId]
  );

  //   const handleCancel = useCallback(() => {

  //   }, []);
  const onDeleteModalClose = () => setShowDelete(false);

  const handleDelete = useCallback(() => {
    dispatch(deleteObject({ fetchObj, id: objectId }));
    setDeleted(true);
  }, [dispatch, fetchObj, objectId]);

  return (
    <>
      <CusDialog
        open={open}
        onClose={onClose}
        title={title}
        dividers
        fullScreen={fullScreen}
        content={
          <>
            <CusForm
              handleSubmit={handleSubmit}
              handleCancel={onClose}
              submitStatus={putStatus}
              formInputs={formInputs}
              fileInput={fileInput} //or single
              defaultValue={initObject || object}
              hiddenField={["pwd"]}
              formType="PUT"
            />
            <ErrorSnackBar
              error={errorMsg?.split("]")[1]}
              onClose={() => dispatch(reSetError())}
            />
          </>
        }
        actions={[
          ...actions.map((action) => ({
            ...action,
            onClick: () => action.onClick(objectId),
          })),
          moreDetails && {
            label: t("general.moreDetail"),
            variant: "contained",
            onClick: () => {
              console.log(`${objectId}`);
              navigate(`${objectId}`);
            },
          },
          {
            label: t("general.delete"),
            color: "error",
            onClick: () => setShowDelete(true),
          },
        ]}
        justifyAction={justifyAction}
      />
      <ConfirmDeleteDialog
        open={showDelete}
        onClose={onDeleteModalClose}
        handleDelete={handleDelete}
      />
    </>
  );
}
