const palette = {
  primary: { main: "#e59432", light: "#e5943240" },
  // secondary: { main: "#0a2cae" },
  purchase: { main: "#0e7ee1" },
  purchaseMid: { main: "#0e7ee1cc" },
  purchaseLight: { main: "#0e7ee199" },
  sale: { main: "#0a8aa7" },
  saleMid: { main: "#0a8aa7cc" },
  saleLight: { main: "#0a8aa799" },
  // error: { main: "#EE9E5B" },
  warning: { main: "#FDD074" },
  custom: {
    primary: "#040000",
    primaryMid: "#0400004D",
    primaryLight: "#0400001a",
    gray: "#EEEEEE",
    white: "#fff",
    whiteLight: "#ffffff80",
    selected: "#0e7ee1c7",
    warning: "#FDD074",
    error: "#EE9E5B",
  },
};
export const theme = {
  palette,
};

export const { danger } = palette.custom;
