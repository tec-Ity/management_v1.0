const loginFormProps = [
  ///////dns
  {
    formProps: {
      gridSize: 12,
      isShow: () => {
        return localStorage.getItem("DNS")?.substring(0, 4)?.toLowerCase() ===
          "http"
          ? false
          : true;
      },
    },
    general: {
      field: "DNS",
      label: "DNS",
      rules: {
        required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      msg: {},
    },
    itemProps: {
      itemType: "input",
      type: "text",
      // placeholder: "xxx.com",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  ///////code/username
  {
    formProps: { gridSize: 12 },
    general: {
      field: "code",
      rules: {
        required: true,
        length: { min: 4, max: 20 },
        type: "string",
      },
      msg: {},
    },
    itemProps: {
      itemType: "input",
      type: "text",
      placeholder: "email/phone/code",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  ///////pwd
  {
    formProps: { gridSize: 12 },
    general: {
      field: "pwd",
      rules: {
        required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      msg: {},
    },
    itemProps: {
      itemType: "input",
      type: "pwd",
      disabled: false,
      sx: { width: "100%" },
    },
  },
];

export default loginFormProps;
