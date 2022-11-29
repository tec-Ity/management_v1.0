import React, { useState } from "react";
import { Box, Modal, Slider, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
export default function CusImgViewModal({ open, onClose, img_urls, img_url }) {
  const DNS = useSelector((state) => state.auth.DNS);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(150);

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{ style: { cursor: "pointer" } }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* img container */}
        <Box
          sx={{
            flex: 1,
            width: { xs: "100%", md: 800 },
            height: { xs: "100%", md: 800 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          onClick={onClose}
        >
          <HighlightOffOutlinedIcon
            sx={{
              height: 40,
              width: 40,
              position: { xs: "fixed", md: "absolute" },
              top: 10,
              right: 10,
              color: "#fff",
              cursor: "pointer",
              zIndex: 9999,
            }}
            onClick={() => {
              onClose();
              setIndex(0);
              setZoom(100);
            }}
          />
          <Box
            component="img"
            src={DNS + img_url}
            sx={{
              height: (zoom / 100) * 300,
              width: (zoom / 100) * 300,
              maxWidth: 800,
              maxHeight: "calc(100vh - 120px)",
              objectFit: "scale-down",
            }}
          />
        </Box>
        {/* zoom info */}
        <Typography color="white">{zoom}%</Typography>
        {/* controls */}
        <Box
          sx={{
            width: 300,
            height: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
            "& .MuiSvgIcon-root": {
              height: 30,
              width: 30,
              cursor: "pointer",
            },
          }}
        >
          <ZoomOutIcon onClick={() => zoom > 10 && setZoom(zoom - 10)} />
          <Slider
            value={zoom / 2}
            onChange={(e, val) => setZoom(val * 2)}
            sx={{ width: 200 }}
          />
          <ZoomInIcon onClick={() => zoom < 200 && setZoom(zoom + 10)} />
        </Box>
        {img_urls && (
          <Box
            sx={{
              width: 200,
              height: 50,
              mb: 2,
              border: "1px solid #fff",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              color: "#fff",
              "& .MuiSvgIcon-root": {
                height: 40,
                width: 40,
                cursor: "pointer",
              },
            }}
          >
            <ChevronLeftIcon
              onClick={() => index < img_urls.length - 2 && setIndex(index + 1)}
            />
            <Typography>
              {index + 1}/{img_urls?.length || 0}
            </Typography>
            <ChevronRightIcon
              onClick={() => index > 1 && setIndex(index - 1)}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
}
