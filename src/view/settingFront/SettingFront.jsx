import React, { useEffect, useState } from "react";
import CusH6 from "../../component/typography/CusH6";
import CusH5 from "../../component/typography/CusH5";
import FiscalPrintComp from "../_print/FiscalPrintComp.jsx";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Switch,
  Button,
  Divider,
} from "@mui/material";
import CusDialog from "../../component/modal/CusDialog.jsx";
import { useSelector } from "react-redux";
import { changeSettings } from "../../redux/rootSlice";
import { useDispatch } from "react-redux";
import moment from "moment/moment";

const SettingHeader = ({ title }) => {
  return (
    <Grid container item xs={12} justifyContent="center">
      <Grid>
        <CusH6>{title}</CusH6>
      </Grid>
      <Grid sx={{ flex: 1, pt: 2, pl: 2 }}>
        <Divider />
      </Grid>
    </Grid>
  );
};

const CusSwitch = ({ checked, onChange }) => {
  return (
    <Grid item container xs={12} alignItems="center">
      <Typography>关</Typography>
      <Switch checked={Boolean(checked)} onChange={onChange} />
      <Typography>开</Typography>
    </Grid>
  );
};

export default function SettingFront() {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.root.settings);

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <CusH5 sx={{ fontSize: 30 }}>收银设置</CusH5>
        </Grid>
        {/* ------------- 税控 */}
        <FiscalSetting />
        {/* ------------- 小票 */}
        <NormalPrint />
        {/* ------------- 触屏 */}
        <TouchMode settings={settings} dispatch={dispatch} />
        {/* ------------- 离线 */}
        <OfflineMode settings={settings} dispatch={dispatch} />
      </Grid>
    </Container>
  );
}

const TouchMode = ({ settings, dispatch }) => {
  return (
    <>
      <SettingHeader title="触屏模式" />
      <CusSwitch
        checked={settings.touchMode}
        onChange={(e) => {
          console.log(e.target.checked);
          dispatch(
            changeSettings({
              field: "touchMode",
              value: e.target.checked,
            })
          );
        }}
      />
    </>
  );
};

const OfflineMode = ({ settings, dispatch }) => {
  return (
    <>
      <SettingHeader title="离线收银设置" />
      <CusSwitch
        checked={settings.offlineMode}
        onChange={(e) => {
          console.log(e.target.checked);
          dispatch(
            changeSettings({
              field: "offlineMode",
              value: e.target.checked,
            })
          );
        }}
      />
    </>
  );
};

const NormalPrint = () => {
  const [printerList, setPrinterList] = useState([]);
  const [defaultPrinterName, setDefaultPrinterName] = useState(
    localStorage.getItem("deviceName")
  );
  const [showMore, setShowMore] = useState(Boolean(defaultPrinterName));
  // console.log(printerList);
  useEffect(() => {
    window.electron?.printApi.getPrinterList((list) => setPrinterList(list));
  }, []);

  return (
    <>
      <SettingHeader title="普通小票设置" />
      <CusSwitch
        checked={showMore}
        onChange={(e) => {
          if (e.target.checked) setShowMore(true);
          else {
            setShowMore(false);
            setDefaultPrinterName(e.target.value);
            localStorage.setItem("deviceName", e.target.value);
          }
        }}
      />
      {showMore && (
        <Grid
          item
          container
          xs={12}
          sx={{
            display: "flex",
            // justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography>选择默认打印机:</Typography>
          <TextField
            sx={{ width: 200, ml: 2 }}
            select
            label="打印机"
            value={defaultPrinterName}
            onChange={(e) => {
              if (e.target.value) {
                setDefaultPrinterName(e.target.value);
                localStorage.setItem("deviceName", e.target.value);
              }
            }}
          >
            {printerList?.length > 0 ? (
              printerList.map((printer) => (
                <MenuItem key={printer.name} value={printer.name}>
                  {printer.displayName}
                  {printer.name === defaultPrinterName && "（默认）"}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={null}>未检测到打印机</MenuItem>
            )}
          </TextField>
        </Grid>
      )}
    </>
  );
};

const DrawerComp = () => {
  const [open, setOpen] = useState(false);

  return (
    <Grid item xs={12}>
      <Button
        variant="contained"
        sx={{ width: 200, height: 60 }}
        onClick={() => setOpen(true)}
      >
        开钱箱
      </Button>
      <FiscalPrintComp
        instruction={open ? "drawer" : ""}
        onFinish={() => setOpen(false)}
      />
    </Grid>
  );
};
const DailyFiscalComp = () => {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(false);
  const onClose = () => setOpen(false);
  return (
    <Grid item xs={12}>
      <Button
        variant="contained"
        sx={{ width: 200, height: 60 }}
        onClick={() => setOpen(true)}
      >
        日结
      </Button>
      <FiscalPrintComp
        instruction={start ? "zReport" : ""}
        onFinish={() => {
          onClose();
          setStart(false);
        }}
      />
      <CusDialog
        size="xs"
        open={open}
        onClose={onClose}
        title={`是否确认进行日结 (${moment().format("DD/MM/YYYY")})`}
        actions={[
          { label: "取消", onClick: onClose },
          {
            label: "确认",
            variant: "contained",
            onClick: () => {
              setStart(true);
            },
          },
        ]}
        justifyAction="center"
      />
    </Grid>
  );
};

const FiscalSetting = () => {
  const list = ["EPSON"];
  const dispatch = useDispatch();
  const [printer, setPrinter] = useState("");
  const inputPath = useSelector((state) => state.root.settings?.inputPath);
  const fiscalPrinter = useSelector(
    (state) => state.root.settings?.fiscalPrinter
  );
  const [showMore, setShowMore] = useState(Boolean(fiscalPrinter));
  return (
    <>
      <SettingHeader title="税控设置" />
      <CusSwitch
        checked={showMore}
        onChange={(e) => {
          if (e.target.checked) setShowMore(true);
          else {
            dispatch(
              changeSettings({
                field: "fiscalPrinter",
                value: "",
              })
            );
            setShowMore(false);
          }
        }}
      />
      {showMore && (
        <>
          <DrawerComp />
          <DailyFiscalComp />
          <Grid
            item
            container
            xs={12}
            sx={{
              display: "flex",
              // justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Typography>选择税控机:</Typography>
            <TextField
              sx={{ width: 200, ml: 2 }}
              select
              label="税控机"
              value={fiscalPrinter}
              onChange={(e) => {
                if (e.target.value) {
                  dispatch(
                    changeSettings({
                      field: "fiscalPrinter",
                      value: e.target.value,
                    })
                  );
                }
              }}
            >
              {list.map((printer) => (
                <MenuItem key={printer} value={printer}>
                  {printer}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sx={{
              display: "flex",
              // justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Typography>输入文件路径:</Typography>
            <TextField
              sx={{ width: 500, ml: 2 }}
              label="文件路径"
              placeholder="C://ProgramFiles/xxx/xxx"
              value={inputPath}
              onChange={(e) => {
                if (e.target.value) {
                  dispatch(
                    changeSettings({
                      field: "inputPath",
                      value: e.target.value,
                    })
                  );
                }
              }}
            />
          </Grid>
        </>
      )}
    </>
  );
};
