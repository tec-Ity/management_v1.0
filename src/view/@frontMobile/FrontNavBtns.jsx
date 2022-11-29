import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { setTabIndex } from "../../redux/rootSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ClientModal from "../../component/modal/ClientModal";
import { cartSubjectPost, initCart } from "../cart/reducer/cartSlice";

export default function FrontNavBtns({
  type,
  section,
  onBtnClick = (key) => {},
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSupplierModal, setShowSupplierModal] = React.useState(false);
  //key
  //-0 后台
  //-1 销售
  //-2 采购
  return (
    <Stack spacing={2} sx={{ width: "100%", pt: type && 2 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ height: 50 }}
        onClick={() => {
          navigate("/B/dashboard");
          dispatch(setTabIndex(0));
          onBtnClick(0);
        }}
      >
        {section === "back" && !type ? (
          <RadioButtonCheckedIcon />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
        <Typography sx={{ pl: 1 }}>后台</Typography>
      </Button>
      <Button
        color="sale"
        variant="contained"
        size="large"
        sx={{ height: 50 }}
        onClick={() => {
          navigate("/F");
          dispatch(setTabIndex(0));
          onBtnClick(1);
        }}
      >
        {type === -1 ? (
          <RadioButtonCheckedIcon />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
        <Typography sx={{ pl: 1 }}>销售</Typography>
      </Button>
      <Button
        variant="contained"
        color="purchase"
        size="large"
        sx={{ height: 50 }}
        onClick={() => setShowSupplierModal(true)}
      >
        {type === 1 ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
        <Typography sx={{ pl: 1 }}>采购</Typography>
      </Button>
      <ClientModal
        type={1}
        open={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        handleSelectClient={(subject) => {
          navigate("/B/purchase");
          dispatch(initCart({ type: 1 }));
          dispatch(cartSubjectPost({ subject }));
          dispatch(setTabIndex(0));
          onBtnClick(2);
        }}
      />
    </Stack>
  );
}
