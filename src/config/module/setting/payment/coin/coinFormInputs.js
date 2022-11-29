const coinFormInputs = [
  ///////code
  {
    formProps: { gridSize: 6 },
    general: {
      field: "code",
      rules: {
        required: true,
        length: { min: 3, max: 20 },
        type: "string",
      },
      msg: {},
      label: "code",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "nome",
      rules: {
        required: true,
        // //length: { min: 2, max:3 },
        type: "string",
      },
      msg: {},
      label: "nome",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "rate",
      rules: {
        required: true,
        // //length: { min: 2, max:3 },
        type: "string",
      },
      msg: {},
      label: "rate",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "symbol",
      rules: {
        required: true,
        //length: { min: 1, max: 1 },
        type: "string",
      },
      msg: {},
      label: "symbol",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
      placeholder: "€/¥/$/...",
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "sort",
      rules: {},
      msg: {},
      label: "sort",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
      placeholder: "0 ~ 999",
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "is_defCoin",
      rules: {},
      msg: {},
      label: "isDefault",
    },
    itemProps: {
      itemType: "checkBox",
      disabled: false,
      sx: { width: "100%" },
    },
  },
];

export default coinFormInputs;
