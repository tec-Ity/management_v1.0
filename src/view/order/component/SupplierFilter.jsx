import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setQuery } from "../../../redux/fetchSlice";

import ClientModal from "../../../component/modal/ClientModal.jsx";
import CusFilterDialog from "../../../component/filter/CusFilterDialog";
import CusCardDS from "../../../component/card/CusCardDS";
import ClientCardUI from "../../client/component/ClientCardUI";

export default function ClientFilter({ fetchObjs, type = -1 }) {
  const dispatch = useDispatch();
  const [subject, setSubject] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const handleSelSubject = (field) => (subject) => {
    try {
      let Subject = "";
      switch (field) {
        case "all":
          Subject = "";
          setSubject(null);
          break;
        case "null":
          Subject = "null";
          setSubject(null);
          break;
        case "subject":
          if (!subject) throw new Error("Invalid subject");
          Subject = [subject._id];
          setShowClientModal(false);
          setSubject(subject);
          break;
        default:
          throw new Error("Invalid subject field");
      }
      dispatch(
        setQuery({
          fetchObjs,
          query: { [type === 1 ? "Supplier" : "Client"]: Subject },
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const items = [
    { content: "不限", handleClick: handleSelSubject("all") },
    type !== 1 && { content: "散客", handleClick: handleSelSubject("null") },
    {
      content: type === 1 ? "供应商" : "会员",
      extraContent: subject && (
        <CusCardDS busType={type === 1 ? "purchase" : "sale"}>
          <ClientCardUI obj={subject} />
        </CusCardDS>
      ),
      handleClick: () => setShowClientModal(true),
    },
  ];

  return (
    <>
      <CusFilterDialog
        label={type === 1 ? "供应商" : "客户"}
        items={items}
        color={type === 1 ? "error" : "primary"}
      />
      <ClientModal
        open={showClientModal}
        onClose={() => setShowClientModal(false)}
        type={type}
        handleSelectClient={handleSelSubject("subject")}
      />
    </>
  );
}
