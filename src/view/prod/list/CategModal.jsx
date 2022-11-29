import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CusModal from "../../../component/modal/CusModal";
import { getObjects, selectObjects } from "../../../redux/fetchSlice";
import {
  fetchObjFst,
  fetchObjsFst,
  fetchObjsSec,
  fetchObjSec,
} from "../../../config/module/category/categConf";
import CusPostModal from "../../../component/modal/CusPostModal";
import CusPutModal from "../../../component/modal/CusPutModal";
import categFormInputs from "../../../config/module/category/categFormInputs";
import { t } from "i18next";
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DiscountIcon from "@mui/icons-material/Discount";
import EditIcon from "@mui/icons-material/Edit";
import CusH6 from "../../../component/typography/CusH6";
import CusDialog from "../../../component/modal/CusDialog";
import DiscountModal from "./DiscountModal";

export default function CategModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPutModal, setShowPutModal] = useState(false);
  const [curCateg, setCurCateg] = useState(null); //obj
  const [selFirstCateg, setSelFirstCateg] = useState(null); //id
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const firstCategs = useSelector(selectObjects(fetchObjsFst.flag));
  const secondCategs = firstCategs?.find(
    (categ) => categ._id === selFirstCateg
  )?.Categ_sons;
  console.log(111, curCateg, selFirstCateg, secondCategs);
  //
  useEffect(() => {
    open &&
      !firstCategs?.length > 0 &&
      dispatch(getObjects({ fetchObjs: fetchObjsFst }));
    return () => {
      setSelFirstCateg(null);
    };
  }, [dispatch, open]);

  return (
    <>
      <CusModal
        sx={{
          width: { xs: "100%", md: "40%" },
          height: { sx: "100%", md: "70%" },
        }}
        open={open}
        onClose={onClose}
      >
        <Grid
          container
          sx={{ width: "100%", height: "100" }}
          alignContent="flex-start"
        >
          {/* ------- header */}
          <Grid
            item
            container
            xs={12}
            justifyContent="space-between"
            sx={{ pb: 3 }}
          >
            <CusH6 type="standard">分类管理</CusH6>
            {/* <Button variant="contained" onClick={() => setShowPostModal(true)}>
              <AddIcon />
              {t("general.addNew")}
            </Button> */}
          </Grid>
          {/* ----- first category */}
          <Grid container item xs={12} columnSpacing={2}>
            {[
              {
                title: "一级分类",
                key: 1,
                objects: firstCategs,
                onItemClick: (obj) => {
                  setSelFirstCateg(obj?._id);
                },
              },
              {
                title: "二级分类",
                key: 2,
                objects: secondCategs,
              },
            ].map((categObj) => {
              const {
                title,
                key,
                objects,
                // onEditClick = () => {},
                onItemClick = () => {},
                onAddClick = () => {},
              } = categObj;
              return (
                <Grid container item xs={6} key={key}>
                  <Grid container item xs={12} justifyContent="space-between">
                    <Typography variant="h6">{title}</Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setShowPostModal(key);
                        onAddClick();
                      }}
                    >
                      <AddIcon />
                      {/* {t("general.addNew")} */}
                    </Button>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    sx={{
                      height: { xs: "80vh", md: "55vh" },
                      overflowY: "scroll",
                      "&::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    <List sx={{ width: "100%", flex: 1 }}>
                      {objects?.length > 0 ? (
                        objects.map((obj) => {
                          const { _id, nome } = obj;
                          return (
                            <ListItem
                              key={_id}
                              button
                              divider
                              selected={_id === selFirstCateg}
                              onClick={() => onItemClick(obj)}
                              sx={{ borderRadius: "10px" }}
                              secondaryAction={
                                <>
                                  <IconButton
                                    edge="start"
                                    aria-label="discount"
                                    onClick={() => {
                                      setCurCateg(obj);
                                      setShowDiscountModal(true);
                                    }}
                                  >
                                    <DiscountIcon />
                                  </IconButton>
                                  <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => {
                                      setCurCateg(obj);
                                      setShowPutModal(key);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </>
                              }
                              disablePadding
                            >
                              <ListItemButton>
                                <ListItemText>{nome}</ListItemText>
                              </ListItemButton>
                            </ListItem>
                          );
                        })
                      ) : (
                        <ListItem>
                          <Typography>暂无{title}</Typography>
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              sx={{ width: "100%", mt: 3 }}
              onClick={onClose}
            >
              {t("general.confirm")}
            </Button>
          </Grid>
        </Grid>
      </CusModal>
      {/* post */}
      <CusPostModal
        open={Boolean(showPostModal)}
        onClose={() => setShowPostModal(false)}
        title={`新建${showPostModal === 1 ? "一级" : "二级"}分类`}
        fetchObj={showPostModal === 1 ? fetchObjFst : fetchObjSec}
        formInputs={categFormInputs}
        defaultValue={
          showPostModal === 2
            ? { Categ_far: selFirstCateg, categLevel: 2 }
            : { categLevel: 1 }
        }
      />
      {/* put */}
      <CusPutModal
        open={Boolean(showPutModal)}
        onClose={() => {
          setShowPutModal(false);
          setCurCateg(null);
        }}
        initFetch={false}
        fetchObj={showPutModal === 1 ? fetchObjFst : fetchObjSec}
        objectId={curCateg?._id}
        initObject={
          showPutModal === 2
            ? { ...curCateg, Categ_far: selFirstCateg, categLevel: 2 }
            : { ...curCateg, categLevel: 1 }
        }
        formInputs={categFormInputs}
      />
      <DiscountModal
        open={showDiscountModal}
        onClose={() => {
          setShowDiscountModal(false);
          setCurCateg(null);
        }}
      />
    </>
  );
}
