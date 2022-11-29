import React from "react";
import PadButton from "../../../component/button/PadButton";
import DetailFrontUI from "../../../component/detail/DetailFrontUI";
import CusModal from "../../../component/modal/CusModal";
import OrderDetail from "../../order/component/OrderDetail";
import SuccessSnackBar from "../../../component/popover/SuccessSnackBar.jsx";
import { Grid, Typography, Button } from "@mui/material";

export default function ReceiptModal({
  open,
  onClose,
  order,
  setStartPrint,
  busType,
}) {
  const [alertMsg, setAlertMsg] = React.useState("");
  React.useEffect(() => {
    const printFunc = (e) => {
      //pay
      console.log("print", e);
      if (e?.code === "NumpadEnter") {
        setStartPrint();
        setAlertMsg("开始打印");
      }
    };
    window.addEventListener("keydown", printFunc);
    return () => window.removeEventListener("keydown", printFunc);
  }, []);
  // console.log(11111111);
  return (
    <>
      <CusModal open={open} onClose={onClose} size="lg">
        <Grid
          container
          justifyContent="space-around"
          sx={{ width: "100%", height: "100%" }}
        >
          {/* mb only */}
          <Grid
            container
            item
            xs={12}
            justifyContent="center"
            alignItems="center"
            sx={{ display: { xs: "inherit", md: "none" } }}
          >
            <Typography variant="h4" fontWeight={700} color="custom.primary">
              支付成功!
            </Typography>
          </Grid>
          {/* order detail */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              height: { xs: "75%", md: "auto" },
              borderRadius: "10px",
              boxShadow:
                "0px 6px 6px -3px rgba(0, 0, 0, 0.1),0px 10px 14px 1px rgba(0, 0, 0, 0.14),0px 4px 18px 3px rgba(0, 0, 0, 0.11)",
            }}
          >
            <DetailFrontUI
              disableTitle
              obj={order}
              DetailCardUI={(obj) => <OrderDetail obj={obj} />}
            />
          </Grid>
          {/* pc only */}
          <Grid
            container
            direction="column"
            item
            xs={5}
            sx={{
              display: { xs: "none", md: "inherit" },
              borderLeft: "1px solid",
              borderColor: "saleMid.main",
            }}
          >
            <Grid
              container
              item
              xs={3}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h4" fontWeight={700} color="custom.primary">
                支付成功!
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid
              container
              item
              xs={3}
              justifyContent="center"
              alignItems="center"
            >
              <PadButton
                label="打印发票"
                sx={{
                  width: "70%",
                  height: "100%",
                  bgcolor: "saleLight.main",
                }}
                handleClick={setStartPrint}
              />
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:before": {
                  content: "' '",
                  height: 0,
                  margin: "auto",
                  width: "80%",
                  border: "1px solid",
                  borderColor: "saleMid.main",
                },
              }}
            ></Grid>
            <Grid
              container
              item
              xs={3}
              justifyContent="center"
              alignItems="center"
            >
              <PadButton
                label="不打票"
                sx={{
                  width: "70%",
                  height: "100%",
                  bgcolor: "custom.primaryLight",
                }}
                handleClick={onClose}
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{ height: 50, display: { xs: "inherit", md: "none" } }}
            justifyContent="space-evenly"
          >
            <Button
              onClick={onClose}
              variant="outlined"
              size="large"
              color="warning"
              sx={{ width: "30%" }}
            >
              不打票
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              size="large"
              color="warning"
              sx={{ width: "30%" }}
            >
              税票
            </Button>
            <Button
              onClick={() => {
                setStartPrint();
                setAlertMsg("开始打印");
              }}
              color={busType + "Light"}
              variant="contained"
              size="large"
              sx={{ width: "30%" }}
            >
              小票
            </Button>
          </Grid>
        </Grid>
      </CusModal>
      <SuccessSnackBar msg={alertMsg} onClose={() => setAlertMsg("")} />
    </>
  );
}
