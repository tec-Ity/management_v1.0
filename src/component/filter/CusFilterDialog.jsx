import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Grid,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";

export default function CusFilterDialog({
  label,
  items,
  defaultSel = 0,
  sxBtn,
  sxDialog,
  busType,
}) {
  // const { t } = useTranslation();
  // const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(defaultSel);
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  // if (label === "客户") console.log(11111111, items, selected, items[selected]);
  useEffect(() => {
    console.log(10101, label, selected);
    return () => console.log(20202);
  }, []);
  return (
    <Box>
      <Button
        color={busType + "Light"}
        size="small"
        sx={{
          minWidth: 80,
          borderRadius: "25px",
          ...sxBtn,
        }}
        variant={selected === 0 ? "outlined" : "contained"}
        onClick={() => setShowModal(true)}
      >
        <Typography variant={isMB ? "body2" : "body1"}>
          {/* 1：选择0为默认，不展示内容。2：优先展示额外的btnLabel*/}
          {selected === 0
            ? label
            : `${label}:${
                items[selected]?.btnLabel || items[selected].content
              }`}
        </Typography>
        <KeyboardArrowDownIcon />
      </Button>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <Paper
          sx={{
            maxHeight: 450,
            overflowY: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            width: { xs: "100%", md: 413 },
            boxSizing: "border-box",
            p: { xs: 1, md: 3 },
            ...sxDialog,
          }}
        >
          <Grid
            container
            alignContent="flex-start"
            sx={{ height: "100%" }}
            justifyContent="center"
          >
            {items?.map((item, index) => (
              <React.Fragment key={index}>
                {item.content &&
                  !item.hideContent &&
                  typeof item.content === "string" && (
                    <Grid
                      item
                      container
                      xs={12}
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        minHeight: isMB ? 30 : 50,
                      }}
                    >
                      <Button
                        size={isMB ? "small" : "medium"}
                        sx={{
                          height: "100%",
                          width: "100%",
                          fontSize: 20,
                        }}
                        color={`${busType}`}
                        variant={selected === index ? "contained" : "standard"}
                        onClick={() => {
                          console.log(222, index, item);
                          setSelected(index);
                          setShowModal(false);
                          item.handleClick && item.handleClick();
                        }}
                      >
                        {item.content}
                      </Button>
                    </Grid>
                  )}
                {(item.extraContent || item.getExtraContent) && (
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      p: { xs: 0, md: 1 },
                    }}
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => setSelected(index)}
                  >
                    <Box
                      sx={{
                        p: { xs: 0, md: 1 },
                        ...(selected === index && {
                          border: "1.5px solid",
                          borderColor: `${busType}Mid.main`,
                          borderRadius: "10px",
                        }),
                      }}
                    >
                      {item.extraContent ||
                        (item.getExtraContent &&
                          item.getExtraContent({
                            onClose: () => setShowModal(false),
                          }))}
                    </Box>
                  </Grid>
                )}
                {/* border bottom */}
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ minHeight: isMB ? 10 : 20 }}
                >
                  <Box
                    sx={{
                      height: "1px",
                      width: 300,
                      bgcolor: `${busType}Light.main`,
                    }}
                  ></Box>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Paper>
      </Dialog>
    </Box>
  );
}
