import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function CusDialog({
  open,
  onClose,
  ariaLabel,
  size = "lg",
  title,
  content,
  actions, //{label,color,variant,onClick}
  dividers = false,
  fullScreen,
  fullWidth = true,
  justifyAction,
  showCloseIcon = true,
}) {
  return (
    <Dialog
      open={open || false}
      onClose={onClose}
      aria-labelledby={ariaLabel}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      maxWidth={size}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {title?.toUpperCase()}
        {onClose && showCloseIcon ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent dividers={dividers} sx={{ px: { xs: 1, md: 2 } }}>
        {content}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ justifyContent: justifyAction }}>
          {actions?.map(
            (action) =>
              action && (
                <Button
                  key={action.label}
                  color={action.color || "primary"}
                  variant={action.variant || "outlined"}
                  onClick={action.onClick}
                  sx={action.sx}
                >
                  {action.label}
                </Button>
              )
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
