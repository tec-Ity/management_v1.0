import clientConf from "./clientConf";
const clientFormInputs = [
  ///////code
  {
    formProps: { gridSize: 6 },
    general: {
      field: "code",
      rules: {
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
  /////////name
  {
    formProps: { gridSize: 6 },
    general: {
      field: "nome",
      rules: {
        required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "nome",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  /////////contact
  {
    formProps: { gridSize: 6 },
    general: {
      field: "contact",
      rules: {
        // required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "contact",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  /////////pwd
  // {
  //   formProps: { gridSize: 6 },
  //   general: {
  //     field: "pwd",
  //     rules: {
  //       required: true,
  //       //length: { min: 4, max: 16 },
  //       type: "string",
  //     },
  //     label: "pwd",
  //   },
  //   itemProps: {
  //     itemType: "input",
  //     type: "pwd",
  //     disabled: false,
  //     sx: { width: "100%" },
  //   },
  // },
];

const clientFormImg = {
  type: "image",
  hidden: false,
  disabled: false,
  accept: "image/*",
  multiple: false,
  message: "onlyImage",
};

export default clientFormInputs;
export { clientFormImg };
