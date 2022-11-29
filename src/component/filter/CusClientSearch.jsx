import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//conf
import {
  fetchObjs as fetchObjsClient,
  fetchObj as fetchObjClient,
} from "../../config/module/client/clientConf";
import {
  fetchObjs as fetchObjsSup,
  fetchObj as fetchObjSup,
} from "../../config/module/supplier/supConf";
import { selectObjects } from "../../redux/fetchSlice";
import clientFormInputs from "../../config/module/client/clientFormInputs";
import supplierFormInputs from "../../config/module/supplier/supFormInputs";
//component
import CusPostModal from "../modal/CusPostModal.jsx";
import SearchComp from "../search/SearchComp";
import CusCardDS from "../card/CusCardDS.jsx";
import ClientCardUI from "../../view/client/component/ClientCardUI.jsx";
//mui
import { Box, Grid, Typography, Divider, Button } from "@mui/material";
import CloseButton from "../button/CloseButton";
import CusAddButton from "../button/CusAddButton";

export default function CusClientSearch({
  type,
  handleSelectClient,
  onClose = () => {},
  allowAddNew,
  showCancel,
}) {
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  const busType = type === 1 ? "purchase" : "sale";
  // const [submitted, setSubmitted] = React.useState(false);
  const subjectName = type === 1 ? "供应商" : "会员";
  const [selectedCode, setSelectedCode] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const fetchObjs = useMemo(
    () => (type === 1 ? fetchObjsSup : fetchObjsClient),
    [type]
  );
  const fetchObj = type === 1 ? fetchObjSup : fetchObjClient;
  const formInputs = type === 1 ? supplierFormInputs : clientFormInputs;
  // const getStatus = useSelector((state) => state.fetch.getStatus);
  const clients = useSelector(selectObjects(fetchObjs.flag));

  const onSearchSelect = (code) => {
    // setSubmitted(true);
    setSelectedCode(code);
  };

  // useEffect(() => {
  //   if (selectedCode && getStatus === "succeed") {
  //     if (!clients || clients.length === 0) {
  //       setShowAddClient(true);
  //     }
  //   }
  // }, [getStatus, selectedCode]);

  return (
    <>
      <Grid container alignContent="flex-start" sx={{ height: "100%" }}>
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
          alignContent="flex-start"
        >
          <Grid item xs={10}>
            <SearchComp
              initFetch
              realTime
              placeholder={"搜索" + subjectName}
              fetchObjs={fetchObjs}
              style={{ borderColor: "saleMid.main" }}
              onSelect={allowAddNew && onSearchSelect}
            />
          </Grid>
          <Grid container item xs={2} justifyContent="flex-end">
            <CloseButton onClick={onClose} busType={busType} />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          alignContent="flex-start"
          sx={{
            height: 350,
            pt: 1,
            overflowY: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Grid item xs={12}>
            <Typography sx={{ ml: 0.5, mb: 1 }}>
              请输入{subjectName}号/手机号, 或添加
            </Typography>
          </Grid>
          <Grid container item xs={12} alignItems="center">
            <Grid item xs={6}>
              <CusAddButton
                size={isMB ? "sm" : "md"}
                busType={busType}
                handleClick={() => setShowAddClient(true)}
              />
            </Grid>
            {showCancel && (
              <>
                <Grid xs={1} />
                <Grid xs={5}>
                  <Button
                    variant="outlined"
                    size="large"
                    color="error"
                    onClick={() => handleSelectClient(null)}
                    sx={{ height: "100%", width: "100%" }}
                  >
                    取消{type === 1 ? "供应商" : "会员"}
                  </Button>
                </Grid>
              </>
            )}
            {/* {isMB && (
              <Typography
                color={`${busType}Mid.main`}
                fontWeight={700}
                sx={{ ml: 2 }}
              >
                添加新{subjectName}
              </Typography>
            )} */}
          </Grid>
          {clients.map((client) => (
            <Grid
              container
              item
              xs={10}
              key={client._id}
              sx={{ pt: { xs: 1, md: 2 }, flexDirection: "column" }}
            >
              {false ? (
                <>
                  <Typography onClick={() => handleSelectClient(client)}>
                    {client.nome}
                  </Typography>
                  <Divider sx={{ width: "100%" }} />
                </>
              ) : (
                <CusCardDS
                  busType={busType}
                  key={client._id}
                  onClick={() => handleSelectClient(client)}
                  sx={{ height: 130 }}
                >
                  <ClientCardUI obj={client} busType={busType} />
                </CusCardDS>
              )}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <CusPostModal
        open={showAddClient}
        onClose={() => setShowAddClient(false)}
        formInputs={formInputs}
        title={"添加" + subjectName}
        fetchObj={fetchObj}
        // defaultValue={{ code: selectedCode }}
        defaultValue={type === 1 && { Firm: "Supplier" }}
        submittedCallback={(obj) => handleSelectClient(obj)}
      />
    </>
  );
}
