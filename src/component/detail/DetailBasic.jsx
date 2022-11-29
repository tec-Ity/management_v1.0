import React, { useState, useCallback } from "react";

import CusForm from "../../component/form/CusForm";
import { deleteObject, putObject, postObject } from "../../redux/fetchSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DetailBasic({
  fetchObj,
  _id,
  obj: initObject,
  formInputs,
  formImg,
  submitCallback,
  type = "PUT",
}) {
  const dispatch = useDispatch();
  const putStatus = useSelector((state) => state.fetch.putStatus);

  const handleSubmit = useCallback(
    (formValue) => {
      const formData = new FormData();
      const { image, imageSmall, ...obj } = formValue;
      console.log(image, imageSmall);
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
      console.log("put", initObject, obj, newObj);

      formData.append("obj", JSON.stringify(initObject ? newObj : obj));
      image && formData.append("img_url", image[0]);
      imageSmall && formData.append("img_xs", imageSmall[0]);
      const data = image ? formData : { general: obj };
      // for (const value of formData.values()) {
      //   console.log(value);
      // }

      if (type === "PUT") dispatch(putObject({ fetchObj, data, id: _id }));
      else if (type === "POST") dispatch(postObject({ fetchObj, data }));
      submitCallback && submitCallback();
    },
    [_id, dispatch, fetchObj, submitCallback, type]
  );

  const handleDelete = () => {
    dispatch(deleteObject({ fetchObj, id: _id }));
  };
  return (
    <CusForm
      handleSubmit={handleSubmit}
      // handleCancel={onClose}
      submitStatus={putStatus}
      formInputs={formInputs}
      fileInput={formImg} //or single
      defaultValue={initObject}
      clearAfterSubmit={false}
      initModify={false}
      handleDelete={handleDelete}
      clearOnCancel={false}
      formType="PUT"
      showTopModifyButton={formInputs.length > 3}
    />
  );
}
