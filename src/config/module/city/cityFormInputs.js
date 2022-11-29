const cityFormInputs = [
  ///////code
  {
    formProps: { gridSize: 6 },
    general: {
      field: "code",
      rules: {
        required: true,
        length: { min: 4, max: 20 },
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
];

export default cityFormInputs;
