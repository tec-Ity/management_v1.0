import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFlagField,
  getObject,
  reSetError,
  selectObject,
} from "../../../redux/fetchSlice";
import ProdAttr from "./ProdAttr";
import ProdSku from "./ProdSku";
import { fetchObj } from "../../../config/module/prod/prodConf";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import CusButtonGroup from "../../../component/buttonGroup/CusButtonGroup.jsx";
import ProdBasic from "./ProdBasic";
import ProdStock from "./ProdStock";
import CusH5 from "../../../component/typography/CusH5";
import ErrorSnackBar from "../../../component/popover/ErrorSnackBar";
import SuccessSnackBar from "../../../component/popover/SuccessSnackBar.jsx";

export default function ProdDetail({ _id, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const prod = useSelector(selectObject(fetchObj.flag));
  console.log(prod);
  // const params = useParams();
  const [compIndex, setCompIndex] = useState(0);
  // const { _id } = params;
  const errorMsg = useSelector((state) => state.fetch.errorMsg);
  const putStatus = useSelector((state) => state.fetch.putStatus);
  const postStatus = useSelector((state) => state.fetch.postStatus);
  const deleteStatus = useSelector((state) => state.fetch.deleteStatus);
  const [prodStatus, setProdStatus] = useState("idle");
  const [prodDeleteStatus, setProdDeleteStatus] = useState("idle");
  const [basicModified, setBasicModified] = useState(false);
  const components = [
    <ProdBasic
      fetchObj={fetchObj}
      _id={_id}
      prod={prod}
      submitCallback={() => setBasicModified(true)}
    />,
    <ProdStock _id={_id} isMB={isMB} is_simple={prod.is_simple} />,
    <ProdAttr prod={prod} _id={_id} />,
    <ProdSku _id={_id} prod={prod} />,
  ];

  //init prod
  useEffect(() => {
    // console.log(getStatus);
    dispatch(getObject({ fetchObj, id: _id }));
    return () => {
      console.log(111111111111, "unmount prodDetail");
      dispatch(clearFlagField({ flag: fetchObj.flag }));
    };
  }, []);

  useEffect(() => {
    if (putStatus === "loading" || postStatus === "loading")
      setProdStatus("loading");
    else if (
      prodStatus === "loading" &&
      (putStatus === "succeed" || postStatus === "succeed")
    ) {
      setProdStatus("succeed");
      if (basicModified)
        setTimeout(() => {
          setBasicModified(false);
          onClose();
        }, 500);
    }

    if (deleteStatus === "loading") setProdDeleteStatus("loading");
    else if (deleteStatus === "succeed" && prodDeleteStatus === "loading") {
      setProdDeleteStatus("succeed");
      !prod?._id &&
        setTimeout(() => {
          onClose();
        }, 500);
    }
  }, [postStatus, putStatus, deleteStatus]);

  const btnObjs = [
    { label: isMB ? "信息" : "基础信息", value: 0 },
    { label: isMB ? "记录" : "商品记录", value: 1 },
    { label: "规格管理", value: 2, width: isMB ? 80 : null },
    { label: "规格商品", value: 3, width: isMB ? 80 : null },
  ];

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
              商品{!isMB && "详情"}
            </Typography>
          </Grid>
          <Grid item sx={{ flex: 1 }}>
            <CusButtonGroup
              busType="sale"
              size={isMB ? "small" : "medium"}
              buttonObjs={btnObjs}
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
            {btnObjs[compIndex].label}
          </CusH5>
          {components[compIndex]}
        </Paper>
      </Container>
      <ErrorSnackBar error={errorMsg} onClose={() => dispatch(reSetError())} />
      <SuccessSnackBar
        msg={
          prodStatus === "succeed"
            ? "修改成功"
            : prodDeleteStatus === "succeed"
            ? "删除成功"
            : ""
        }
        onClose={() => {
          prodStatus === "succeed" && setProdStatus("idle");
          prodDeleteStatus === "succeed" && setProdDeleteStatus("idle");
        }}
      />
    </Container>
  );
}
