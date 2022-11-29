import React, { useState, useCallback } from "react";

import prodFormInputs, {
  prodFormImg,
} from "../../../config/module/prod/prodFormInputs";
import CusForm from "../../../component/form/CusForm";
import { deleteObject, putObject } from "../../../redux/fetchSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ProdBasic({ fetchObj, _id, prod, submitCallback }) {
  const dispatch = useDispatch();
  const putStatus = useSelector((state) => state.fetch.putStatus);

  const handleSubmit = useCallback((formValue) => {
    const formData = new FormData();
    const { image, imageSmall, ...obj } = formValue;
    console.log(image, imageSmall);
    console.log(11111, obj);
    formData.append("obj", JSON.stringify(obj));
    image && formData.append("img_url", image[0]);
    imageSmall && formData.append("img_xs", imageSmall[0]);
    const data = image ? formData : { general: obj };
    // for (const value of formData.values()) {
    //   console.log(value);
    // }

    dispatch(putObject({ fetchObj, data, id: _id }));
    submitCallback && submitCallback();
  }, []);

  const handleDelete = () => {
    dispatch(deleteObject({ fetchObj, id: _id }));
  };
  // console.log("prodBasic", prod);
  return (
    <CusForm
      handleSubmit={handleSubmit}
      // handleCancel={onClose}
      submitStatus={putStatus}
      formInputs={prodFormInputs}
      fileInput={prodFormImg} //or single
      defaultValue={prod}
      clearAfterSubmit={false}
      initModify={false}
      handleDelete={handleDelete}
      clearOnCancel={false}
      formType="PUT"
      showTopModifyButton
    />
  );
}
