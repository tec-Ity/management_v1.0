import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getObjects, selectObjects } from "../../redux/fetchSlice";
import { useTranslation } from "react-i18next";

//component
import CusItemList from "../../component/list/CusItemList";
import CusPageFront from "../../component/page/CusPageFront";
import OrderDetail from "../../view/order/component/OrderDetail.jsx";
import CusPostModal from "../../component/modal/CusPostModal.jsx";
import DetailFrontUI from "../../component/detail/DetailFrontUI";

//mui
import { Box, Container, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export default function CusSubjectListCombine({
  busType,
  section = 1,
  subjectFetchObj,
  subjectFetchObjs,
  orderFetchObjs,
  subjectFormInputs,
  subjectFormImg,
  frontListTitle,
  listNoneMsg,
  detailTitle,
  postTitle,
  backListTitle,
  queryParam,
  SubjectCardUI,
  SubjectDetailUI,
  ...rest
}) {
  const { t } = useTranslation();
  const postSubmittedCallback = useCallback(() => {}, []);
  const dispatch = useDispatch();
  const [curSubjectId, setCurSubjectId] = useState();
  const [curOrder, setCurOrder] = useState();
  const [showAddSubject, setShowAddSubject] = useState(false);
  const orders = useSelector(selectObjects(orderFetchObjs.flag));

  useEffect(() => {
    if (curSubjectId && section === 1) {
      dispatch(
        getObjects({
          fetchObjs: {
            ...orderFetchObjs,
            query: {
              ...orderFetchObjs.query,
              upd_after: null,
              [queryParam]: [curSubjectId],
            },
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curSubjectId]);

  return section === 1 ? (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            transition: "right 0.3s",
            position: "absolute",
            width: "100%",
            right: curOrder ? 700 : 0,
          }}
        >
          <CusPageFront
            busType={busType}
            fetchObjs={subjectFetchObjs}
            listTitle={frontListTitle}
            detailTitle={detailTitle}
            buttons={[
              {
                label: "添加",
                handleClick: () => setShowAddSubject(true),
                sx: { bgcolor: "custom.primaryLight" },
              },
            ]}
            listNoneMsg={listNoneMsg}
            CardUI={SubjectCardUI}
            DetailCardUI={(obj) =>
              obj && (
                <DetailCard
                  UI={SubjectDetailUI}
                  obj={obj}
                  setObjCallBack={(obj) => setCurSubjectId(obj._id)}
                  orders={orders}
                  handleClick={(order) => setCurOrder(order)}
                />
              )
            }
            listCol={2}
            listMaxWidth={641}
          />
        </Box>
        <Box
          sx={{
            transition: "opacity 0.3s, right 0.3s",
            opacity: curOrder ? 1 : 0,
            position: "absolute",
            right: curOrder ? 0 : -700,
            width: 700,
          }}
        >
          <DetailFrontUI
            obj={curOrder}
            DetailCardUI={(obj) => <OrderDetail obj={obj} />}
            detailTitle="订单详情"
            buttons={[
              {
                label: t("general.back"),
                handleClick: () => setCurOrder(null),
                component: ({ label, handleClick }) => (
                  <Button variant="outlined" onClick={handleClick}>
                    <ArrowBackIosIcon /> {label}
                  </Button>
                ),
              },
            ]}
          />
        </Box>
      </Container>
      <CusPostModal
        open={showAddSubject}
        onClose={() => setShowAddSubject(false)}
        title={postTitle}
        fetchObj={subjectFetchObj}
        formInputs={subjectFormInputs}
      />
    </>
  ) : (
    <>
      <CusItemList
        formInputs={subjectFormInputs}
        fileInput={subjectFormImg}
        fetchObjs={subjectFetchObjs}
        fetchObj={subjectFetchObj}
        submittedCallback={postSubmittedCallback}
        title={backListTitle}
        {...rest}
      />
    </>
  );
}

const DetailCard = ({ UI, obj, setObjCallBack, ...rest }) => {
  useEffect(() => {
    setObjCallBack(obj);
  }, [obj]);
  return <UI obj={obj} {...rest} />;
};
