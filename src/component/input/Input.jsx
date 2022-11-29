import React, { useState } from "react";
import "./input.css";
import { Box, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import KeyboardModal from "../keyboard/KeyboardModal";

export default function Input({
  touch = true,
  onFinish = () => {},
  initShowKeyboard,
  keyboardProps = {},
  ...rest
}) {
  const settings = useSelector((state) => state.root.settings);
  const touchMode = settings.touchMode;
  const isMB = useSelector((state) => state.root.view) === "MB";

  return touch && touchMode && !isMB ? (
    <KeyboardInput
      onFinish={onFinish}
      initShowKeyboard={initShowKeyboard}
      keyboardProps={keyboardProps}
      {...rest}
    />
  ) : (
    <TextField
      {...rest}
      label=""
      onChange={(e) => rest.onChange(e.target.value)}
    />
  );
}

export const KeyboardInput = ({
  value,
  label,
  onChange = () => {},
  onBlur = () => {},
  onFinish = () => {},
  sx,
  keyboardProps,
  initShowKeyboard,
  ...rest
}) => {
  const [showModal, setShowModal] = useState(initShowKeyboard || false);
  // console.log(1111, label, pValue, value);

  return (
    <>
      {showModal && (
        <KeyboardModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFinish={onFinish}
          {...keyboardProps}
        />
      )}

      <TextField
        value={value}
        sx={sx}
        onClick={() => setShowModal(true)}
        autoComplete="off"
        onBlur={() => {}}
        {...rest}
      />
    </>
  );
};
