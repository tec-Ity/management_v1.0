import { fetchObjs } from "./categConf";
const categFormInputs = [
  {
    formProps: {
      gridSize: 6,
    },
    general: {
      field: "code",
      rules: {
        required: true,
        //length: { min: 2, max: 16 },
        type: "string",
      },
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
    formProps: {
      gridSize: 6,
    },
    general: {
      field: "nome",
      rules: {
        required: true,
        //length: { min: 2, max: 16 },
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
  {
    formProps: {
      gridSize: 6,
      isShow: ({ formValue }) => formValue.categLevel === 2,
    },
    general: {
      field: "Categ_far",
      rules: {
        required: false,
        // //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "Categ_far",
    },
    itemProps: {
      itemType: "autoComplete",
      // first cate query
      fetchObjs: { ...fetchObjs, query: { ...fetchObjs.query, level: 1 } },
      optionLabel: "nome",
      optionValue: "_id",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  {
    formProps: {
      gridSize: 6,
    },
    general: {
      field: "sort",
      rules: {
        //length: { min: 2, max: 16 },
        type: "string",
      },
      label: "sort",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
];

const categFormImg = {
  type: "image",
  hidden: false,
  disabled: false,
  accept: "image/*",
  multiple: false,
  message: "onlyImage",
};
export default categFormInputs;
export { categFormImg };
