import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFlagField,
  getObject,
  reSetError,
  selectObject,
} from "../../redux/fetchSlice";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import CusButtonGroup from "../../component/buttonGroup/CusButtonGroup.jsx";

import CusH5 from "../typography/CusH5";
import ErrorSnackBar from "../../component/popover/ErrorSnackBar";
import SuccessSnackBar from "../../component/popover/SuccessSnackBar.jsx";
import DetailBasic from "./DetailBasic";
export default function CusItemDetail({
  _id,
  title,
  components,
  groupButtons: extraGroupButtons,
  onClose,
  fetchObj,
  formInputs,
  formImg,
}) {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const obj = useSelector(selectObject(fetchObj.flag));
  const [compIndex, setCompIndex] = useState(0);
  const errorMsg = useSelector((state) => state.fetch.errorMsg);
  const putStatus = useSelector((state) => state.fetch.putStatus);
  const postStatus = useSelector((state) => state.fetch.postStatus);
  const deleteStatus = useSelector((state) => state.fetch.deleteStatus);
  const [objStatus, setObjStatus] = useState("idle");
  const [objDeleteStatus, setObjDeleteStatus] = useState("idle");
  const [basicModified, setBasicModified] = useState(false);
  //add basic
  const groupButtons = [
    { label: isMB ? "信息" : "基础信息", value: 0 },
    ...extraGroupButtons,
  ];
  //init obj
  useEffect(() => {
    // console.log(getStatus);
    dispatch(getObject({ fetchObj, id: _id }));
    return () => {
      console.log(111111111111, "unmount objDetail");
      dispatch(clearFlagField({ flag: fetchObj.flag }));
    };
  }, []);

  useEffect(() => {
    if (putStatus === "loading" || postStatus === "loading")
      setObjStatus("loading");
    else if (
      objStatus === "loading" &&
      (putStatus === "succeed" || postStatus === "succeed")
    ) {
      setObjStatus("succeed");
      if (basicModified)
        setTimeout(() => {
          setBasicModified(false);
          onClose();
        }, 500);
    }

    if (deleteStatus === "loading") setObjDeleteStatus("loading");
    else if (deleteStatus === "succeed" && objDeleteStatus === "loading") {
      setObjDeleteStatus("succeed");
      !obj?._id &&
        setTimeout(() => {
          onClose();
        }, 500);
    }
  }, [postStatus, putStatus, deleteStatus]);

  //component
  const Component = compIndex > 0 ? components[compIndex - 1] : <></>;
  return (
    <Container disableGutters sx={{ position: "relative" }}>
      <Toolbar sx={{ px: 2 }}>
        <Grid container>
          <Grid container alignItems="center" sx={{ width: "fit-content" }}>
            {/* <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIosIcon />
              </IconButton> */}
            <Typography
              variant={isMB ? "h6" : "h5"}
              sx={{ mr: { xs: 1, md: 3 }, ml: { xs: -1, md: 0 } }}
            >
              {title}
              {!isMB && "详情"}
            </Typography>
          </Grid>
          <Grid item sx={{ flex: 1, pl: 3 }}>
            <CusButtonGroup
              busType="sale"
              size={isMB ? "small" : "medium"}
              buttonObjs={groupButtons}
              handleChange={(val) => setCompIndex(val)}
            />
          </Grid>
        </Grid>
      </Toolbar>
      <Container
        sx={{
          height: { xs: "calc(100vh - 100px)", md: "calc(100vh - 180px)" },
          overflowY: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
          px: isMB && 0,
          pt: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 1, md: 3 },
            mb: 2,
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <CusH5 sx={{ mb: 2, display: { xs: "none", md: "inherit" } }}>
            {groupButtons[compIndex].label}
          </CusH5>
          {compIndex === 0 ? (
            <DetailBasic
              _id={_id}
              obj={obj}
              fetchObj={fetchObj}
              formImg={formImg}
              formInputs={formInputs}
              submitCallback={onClose}
            />
          ) : (
            <Component _id={_id} obj={obj} isMB={isMB} />
          )}
        </Paper>
      </Container>
      <ErrorSnackBar error={errorMsg} onClose={() => dispatch(reSetError())} />
      <SuccessSnackBar
        msg={
          objStatus === "succeed"
            ? "修改成功"
            : objDeleteStatus === "succeed"
            ? "删除成功"
            : ""
        }
        onClose={() => {
          objStatus === "succeed" && setObjStatus("idle");
          objDeleteStatus === "succeed" && setObjDeleteStatus("idle");
        }}
      />
    </Container>
  );
}
