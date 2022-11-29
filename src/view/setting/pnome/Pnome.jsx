import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CusDialog from "../../../component/modal/CusDialog";
import { getObjects } from "../../../redux/fetchSlice";
import SettingHeader from "../component/SettingHeader";

export default function Pnome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = React.useState(false);
  const getStatus = useSelector((state) => state.fetch.getStatus);

  return (
    <>
      <SettingHeader title="pnome" />
      <Button
        size="large"
        variant="contained"
        sx={{ width: "100%", mt: 5 }}
        onClick={() => {
          dispatch(getObjects({ fetchObjs: { api: "/pnomeRevise" } }));
          setSubmitted(true);
        }}
      >
        开始校准商品名称
      </Button>
      <CusDialog
        open={submitted && getStatus === "succeed"}
        title="校准成功"
        // size="sm"
        // fullWidth={false}
        content={
          <Button
            variant="contained"
            sx={{ margin: "auto", width: "100%" }}
            onClick={() => {
              navigate(-1);
              setSubmitted(false);
            }}
          >
            确认
          </Button>
        }
      />
    </>
  );
}
