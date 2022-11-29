import React from "react";
import CusItemList from "../../../component/list/CusItemList";
import { fetchObjs, fetchObj } from "../../../config/module/shop/shopConf";
import shopFormInputs, {
  shopFormImg,
} from "../../../config/module/shop/shopFormInputs";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SettingHeader from "../component/SettingHeader";
import { Container, Grid } from "@mui/material";
import CusForm from "../../../component/form/CusForm";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getObject, putObject, selectObject } from "../../../redux/fetchSlice";
import { useSelector } from "react-redux";
import { updateUserInfo } from "../../../redux/authSlice";
export default function ShopPage() {
  const dispatch = useDispatch();
  const shopId = useSelector((state) => state.auth?.userInfo?.Shop?._id);
  const shop = useSelector(selectObject(fetchObj.flag));
  const putStatus = useSelector((state) => state.fetch.putStatus);
  const [submit, setSubmit] = React.useState(false);
  ///init fetch
  useEffect(() => {
    shopId && dispatch(getObject({ fetchObj, id: shopId }));
  }, [dispatch, shopId]);

  //submit callback
  //update userinfo
  useEffect(() => {
    if (submit && putStatus === "succeed") {
      dispatch(updateUserInfo({ field: "Shop", value: shop }));
      setSubmit(false);
    }
  }, [submit, putStatus]);

  return (
    <Container>
      <SettingHeader title={"shop"} />
      <Grid container justifyContent="center">
        <CusForm
          showTopModifyButton
          formInputs={shopFormInputs}
          // fileInput={shopFormImg}
          defaultValue={shop}
          formType="put"
          initModify={false}
          showFormGroup
          clearAfterSubmit={false}
          clearOnCancel={false}
          handleSubmit={(formValue) => {
            const formData = new FormData();
            const { image, imageSmall, ...obj } = formValue;
            console.log(image, imageSmall);
            console.log(obj);
            formData.append("obj", JSON.stringify(obj));
            image && formData.append("img_url", image[0]);
            imageSmall && formData.append("img_xs", imageSmall[0]);
            const data = image ? formData : { general: obj };
            // for (const value of formData.values()) {
            //   console.log(value);
            // }

            dispatch(putObject({ fetchObj, data, id: shopId }));
            setSubmit(true);
          }}
          submitStatus={putStatus}
        />
      </Grid>
    </Container>
  );
}
