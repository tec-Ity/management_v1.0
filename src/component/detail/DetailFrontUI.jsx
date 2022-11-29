import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import PadButton from "../button/PadButton.jsx";

export default function DetailFrontUI({
  obj,
  DetailCardUI,
  detailTitle,
  buttons,
  disableTitle = false,
  onDelete,
  maxWidth = "md",
}) {
  return (
    <Grid container alignContent="flex-start" sx={{ height: "100%" }}>
      {!disableTitle && (
        <Grid
          container
          item
          xs={12}
          sx={{
            width: "100%",
            // height: "100%",
            height: { xs: 60, md: 85 },
            // border: "1px solid",
            maxWidth: maxWidth === "md" ? 567 : 700,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {obj ? (
            typeof detailTitle === "string" ? (
              <Typography
                sx={{ fontWeight: 700, fontSize: 26 }}
                color="custom.primary"
              >
                {detailTitle}
              </Typography>
            ) : (
              detailTitle
            )
          ) : (
            <>&nbsp;</>
          )}
          <Grid container>
            {buttons?.map((buttonObj, index) => {
              const { component, label, sx, handleClick, disabled } = buttonObj;
              const Component = component ? component : PadButton;
              return (
                <Grid
                  container
                  item
                  xs={12 / buttons.length}
                  sx={{ pl: 1, minWidth: 65 }}
                  key={index}
                  justifyContent="flex-end"
                >
                  <Component
                    label={label}
                    sx={sx}
                    disabled={disabled}
                    handleClick={() => handleClick(obj)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        // justifyContent="center"
        sx={{
          display: !obj && "none",
          position: "relative",
          height: disableTitle ? "100%" : "calc(100vh - 170px)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            overflowY: "scroll",
            // width: "100%",
            // height: "100%",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              height: "fit-content",
              minHeight: "100%",
              width: "100%",
              maxWidth: maxWidth === "md" ? 567 : 700,
              boxSizing: "border-box",
              p: { xs: 1, md: 3 },
              borderRadius: "10px",
              bgcolor: "custom.whiteLight",
            }}
          >
            {obj && DetailCardUI(obj, onDelete)}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
