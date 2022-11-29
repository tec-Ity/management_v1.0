import React, { useEffect } from "react";
import { changeView } from "../../redux/rootSlice";
import { useDispatch } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function MobileListener({ children }) {
  const dispatch = useDispatch();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  //detect media
  useEffect(() => {
    isMobile ? dispatch(changeView("MB")) : dispatch(changeView("PC"));
  }, [dispatch, isMobile]);

  //禁止双指缩放
  useEffect(() => {
    window.addEventListener(
      "touchmove",
      function (event) {
        // console.log(event);
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
    window.addEventListener(
      "touchstart",
      function (event) {
        // console.log(event);
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
    window.addEventListener(
      "touchend",
      function (event) {
        // console.log(event);
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  }, []);
  // if (isMobile) return <>{children}</>;
  return children;
}
