import React from "react";
import { Snackbar, Slide, Typography, Alert } from "@mui/material";
export default function SuccessSnackBar({ msg, onClose, duration = 2000 }) {
  // console.log(11111, msg);
  const handleClose = (e, reason) => {
    // console.log(111111111, reason);
    onClose && onClose();
  };
  return (
    <Snackbar
      key={msg}
      sx={{ zIndex: 99999, height: { xs: 50, md: 100 } }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(msg)}
      onClose={handleClose}
      autoHideDuration={duration}
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
    >
      <Alert
        severity="success"
        variant="filled"
        sx={{
          mt: { xs: 10, md: 2 },
          height: { xs: 50, md: 100 },
          width: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiAlert-icon svg": { height: 40, width: 40 },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {msg}
        </Typography>
      </Alert>
    </Snackbar>
  );
}
