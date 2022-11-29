// import React, { useState, useCallback, useEffect } from "react";
// //redux
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   putObject,
//   getObject,
//   selectObject,
//   deleteObject,
// } from "../../redux/fetchSlice";
// //component
// import CusForm from "../form/CusForm.jsx";
// import CusDialog from "./CusDialog";
// //utils

// //mui

// export default function CusPutModal({
//   title,
//   fetchObj,
//   formInputs,
//   fileInput,
//   objectId,
// }) {
//   //init
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   //state
//   const [submitted, setSubmitted] = useState(false);
//   const [deleted, setDeleted] = useState(false);
//   //selector
//   const object = useSelector(selectObject(fetchObj.flag));
//   const putStatus = useSelector((state) => state.fetch.putStatus);
//   // const getStatus = useSelector((state) => state.fetch.getStatus);
//   const deleteStatus = useSelector((state) => state.fetch.deleteStatus);
//   //effect
//   //init object
//   useEffect(() => {
//     // console.log(getStatus);
//     dispatch(getObject({ fetchObj, id: objectId }));
//   }, []);

//   //func
//   const handleSubmit = useCallback((formValue) => {
//     const formData = new FormData();
//     const { image, ...obj } = formValue;
//     formData.append("obj", JSON.stringify(obj));
//     image?.forEach((img, i) => formData.append("img" + i, img));
//     dispatch(putObject({ fetchObj, formData, obj, id: objectId }));
//     setSubmitted(true);
//   }, []);

//   //   const handleCancel = useCallback(() => {

//   //   }, []);

//   const handleDelete = useCallback(() => {
//     dispatch(deleteObject({ fetchObj, id: objectId }));
//     setDeleted(true);
//   }, [dispatch, fetchObj, objectId]);

//   return (
//     <CusDialog
//       open={open}
//       onClose={onClose}
//       title={title}
//       dividers
//       content={
//         <CusForm
//           handleSubmit={handleSubmit}
//           submitStatus={putStatus}
//           formInputs={formInputs}
//           fileInput={fileInput} //or single
//           defaultValue={object}
//         />
//       }
//       // actions={[
//       //   {
//       //     label: "More Detail",
//       //     variant: "contained",
//       //     onClick: () => {
//       //       navigate(`${fetchObj.api}/${objectId}`);
//       //     },
//       //   },
//       //   { label: "DELETE", color: "error", onClick: handleDelete },
//       // ]}
//     />
//   );
// }
