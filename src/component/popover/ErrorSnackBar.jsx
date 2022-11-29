import React from "react";
import { Snackbar, Slide, Typography, Alert } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
export default function ErrorSnackBar({ error, onClose }) {
  // console.log(error);
  const handleClose = (e, reason) => {
    // console.log(e, reason);
    onClose && onClose();
  };
  return (
    <Snackbar
      key={error}
      sx={{ zIndex: 99999, height: 100 }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={Boolean(error)}
      onClose={handleClose}
      autoHideDuration={3000}
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
    >
      <Alert
        severity="warning"
        variant="filled"
        sx={{
          mt: { xs: 10, md: 2 },
          height: 100,
          width: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiAlert-icon svg": { height: 40, width: 40 },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {error}
        </Typography>
      </Alert>
    </Snackbar>
  );
}
