import { fetchObjs } from "../city/cityConf";
const supFormInputs = [
  ///////code
  {
    formProps: { gridSize: 6 },
    general: {
      field: "code",
      rules: {
        required: true,
        length: { min: 2, max: 4 },
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
        length: { min: 2, max: 20 },
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
  /////////Cita
  // {
  //   formProps: { gridSize: 6 },
  //   general: {
  //     field: "Cita",
  //     subField: "_id",
  //     rules: {
  //       // required: true,
  //       // //length: { min: 4, max: 16 },
  //     },
  //     msg: {},
  //     label: "city",
  //   },
  //   itemProps: {
  //     itemType: "autoComplete",
  //     fetchObjs,
  //     optionLabel: "code",
  //     optionValue: "_id",
  //     disabled: false,
  //     sx: { width: "100%" },
  //   },
  // },
  {
    formProps: { gridSize: 6, hidden: true },
    general: {
      field: "Firm",
      rules: {},
      msg: {},
      label: "Firm",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  /////////phone
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
];

const supFormImg = {
  type: "image",
  hidden: false,
  disabled: false,
  accept: "image/*",
  multiple: false,
  message: "onlyImage",
};
export default supFormInputs;
export { supFormImg };
