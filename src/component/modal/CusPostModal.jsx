import React, { useState, useEffect } from "react";
//redux
import { useDispatch, useSelector } from "react-redux";
import { postObject, reSetError, selectObject } from "../../redux/fetchSlice";

//component
import CusForm from "../form/CusForm.jsx";
import ErrorSnackBar from "../popover/ErrorSnackBar";
//utils
//mui
//comp
import CusDialog from "./CusDialog";

export default function CusPostModal({
  isProdStorage,
  open,
  onClose,
  title = "新建",
  fetchObj,
  formInputs,
  fileInput,
  submittedCallback,
  defaultValue,
  fullScreen,
  activeSubmitButton = true,
  handleCancel = () => {},
  showCloseIcon,
}) {
  //init
  const dispatch = useDispatch();
  //state
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  //selector
  const postStatus = useSelector((state) => state.fetch.postStatus);
  const postedObject = useSelector(selectObject(fetchObj?.flag));
  const errorMsg = useSelector((state) => state.fetch.errorMsg);
  //func
  const handleSubmit = (formValue) => {
    const formData = new FormData();
    const { image, imageSmall, ...obj } = formValue;
    formData.append("obj", JSON.stringify(obj));
    // image?.forEach((img, i) => formData.append("img" + i, img));
    image && formData.append("img_url", image[0]);
    imageSmall && formData.append("img_xs", imageSmall[0]);
    // console.log("post", image, imageSmall);
    for (const value of formData.values()) {
      console.log(value);
    }
    const data = image ? formData : { obj };
    dispatch(postObject({ fetchObj, data }));
    setSubmitted(true);
  };

  //effect
  useEffect(() => {
    if (submitted === true && postStatus === "succeed") {
      setSubmitted(false);
      submittedCallback && submittedCallback(postedObject);
      onClose();
    } else if (submitted === true && postStatus === "error") {
      setShowError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postStatus, submitted]);

  return (
    <CusDialog
      open={open}
      fullScreen={fullScreen}
      onClose={onClose}
      title={title}
      showCloseIcon={showCloseIcon}
      content={
        <>
          <CusForm
            handleSubmit={handleSubmit}
            handleCancel={() => {
              handleCancel();
              onClose();
            }}
            submitStatus={postStatus}
            formInputs={formInputs}
            fileInput={fileInput} //or single
            defaultValue={defaultValue}
            activeSubmitButton={activeSubmitButton}
          />
          <ErrorSnackBar
            error={errorMsg?.split("]")[1]}
            onClose={() => dispatch(reSetError())}
          />
        </>
      }
    />
  );
}
