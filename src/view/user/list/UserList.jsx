import React, { useState } from "react";
import { fetchObj, fetchObjs } from "../../../config/module/user/userConf";
import userFormInputs, {
  userFormImg,
  userPwdFormInputs,
} from "../../../config/module/user/userFormInputs";
import CusItemList from "../../../component/list/CusItemList";
import CusForm from "../../../component/form/CusForm";
import CusDialog from "../../../component/modal/CusDialog";
import { putObject } from "../../../redux/fetchSlice";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../../assets/icons/userIcon.png";
import { Box } from "@mui/material";

export default function UserList() {
  const dispatch = useDispatch();
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const putStatus = useSelector((state) => state.fetch.putStatus);

  const handleSubmitPwd = (formValue) => {
    console.log(formValue);
    dispatch(
      putObject({ fetchObj, id: userId, data: { password: formValue } })
    );
    setSubmitted(true);
  };

  const handleCancel = () => setShowPwdModal(false);

  React.useEffect(() => {
    if (submitted && putStatus === "succeed") {
      setShowPwdModal(false);
      setUserId("");
      setSubmitted(false);
    }
  }, [putStatus, submitted]);
  return (
    <>
      <CusItemList
        showAddNew={false}
        formInputs={userFormInputs}
        fileInput={userFormImg}
        fetchObjs={fetchObjs}
        fetchObj={fetchObj}
        formActionObjs={{
          put: [
            {
              label: "修改密码",
              variant: "contained",
              onClick: (userId) => {
                setShowPwdModal(true);
                setUserId(userId);
              },
            },
          ],
        }}
        title="users"
        CardImage={(props) => <Box component="img" src={userIcon} {...props} />}
      />
      <CusDialog
        open={showPwdModal}
        onClose={() => setShowPwdModal(false)}
        size={"sm"}
        title={"修改密码"}
        content={
          <CusForm
            formInputs={userPwdFormInputs}
            handleSubmit={handleSubmitPwd}
            handleCancel={handleCancel}
            defaultValue={{ _id: userId }}
            // submitStatus={putStatus}
          />
        }
      />
    </>
  );
}
