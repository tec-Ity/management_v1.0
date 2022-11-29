const shopFormInputs = [
  {
    group: "info",
    groupTitle: "basicInfo",
    inputs: [
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
          disabled: true,
          sx: { width: "100%" },
        },
      },
      /////////name
      {
        formProps: { gridSize: 6 },
        general: {
          field: "nome",
          rules: {
            // required: true,
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
      /////////phone
      {
        formProps: { gridSize: 6 },
        general: {
          field: "tel",
          rules: {
            // required: true,
            //length: { min: 4, max: 16 },
            type: "string",
          },
          label: "phone",
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
          field: "zip",
          rules: {
            // required: true,
            //length: { min: 4, max: 16 },
            type: "string",
          },
          label: "zip",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      ///////addr
      {
        formProps: { gridSize: 12 },
        general: {
          field: "addr",
          rules: {
            // required: true,
            //length: { min: 4, max: 16 },
            type: "string",
          },
          label: "addr",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
    ],
  },
  {
    group: "invoice",
    groupTitle: "invoice",
    getInfo: () => "如需开发票，以下信息必须填写",
    inputs: [
      {
        general: {
          field: "name",
          rules: {
            type: "string",
          },
          label: "nameLaw",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        general: {
          field: "vat",
          rules: {
            type: "string",
          },
          label: "pIva",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        general: {
          field: "fc",
          rules: {
            // required: true,
            // length: { min: 4, max: 16 },
            type: "string",
          },
          label: "fiscalCode",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        general: {
          field: "addr",
          rules: {
            type: "string",
          },
          label: "addr",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        general: {
          field: "zip",
          rules: {
            type: "string",
          },
          label: "zip",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        general: {
          field: "province",
          rules: {
            type: "string",
            length: { min: 2, max: 2 },
          },
          label: "province",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        general: {
          field: "city",
          rules: {
            type: "string",
          },
          label: "city",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      // {
      //   general: {
      //     field: "invoice_code",
      //     rules: {
      //       type: "string",
      //       length: { min: 6, max: 6 },
      //     },
      //     label: "invoice_code",
      //   },
      //   itemProps: {
      //     itemType: "input",
      //     type: "text",
      //     disabled: false,
      //     sx: { width: "100%" },
      //   },
      // },
      // {
      //   general: {
      //     field: "invoice_fileName",
      //     rules: {
      //       length: { min: 5, max: 5 },
      //       type: "string",
      //     },
      //     label: "invoice_fileName",
      //   },
      //   itemProps: {
      //     itemType: "input",
      //     type: "text",
      //     disabled: false,
      //     sx: { width: "100%" },
      //   },
      // },
    ],
  },
  {
    group: "auth",
    groupTitle: "cassaAuth",
    inputs: [
      {
        formProps: { gridSize: 6 },
        general: {
          field: "cassa_auth",
          subField: "hide_orders",
          rules: {},
          msg: {},
          label: "hide_orders",
        },
        itemProps: {
          itemType: "checkBox",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      {
        formProps: { gridSize: 6 },
        general: {
          field: "cassa_auth",
          subField: "hide_clients",
          rules: {},
          msg: {},
          label: "hide_clients",
        },
        itemProps: {
          itemType: "checkBox",
          disabled: false,
          sx: { width: "100%" },
        },
      },
    ],
  },
  {
    group: "other",
    groupTitle: "other",
    inputs: [
      {
        formProps: { gridSize: 6 },
        general: {
          field: "allow_Supplier",
          rules: {},
          msg: {},
          label: "allow_Supplier",
        },
        itemProps: {
          itemType: "checkBox",
          disabled: false,
          sx: { width: "100%" },
        },
      },
    ],
  },
  /////////Cita
  // {
  //   formProps: { gridSize: 6 },
  //   general: {
  //     field: "Cita",
  //     subField: "_id",
  //     rules: {
  //       required: true,
  //       // //length: { min: 4, max: 16 },
  //     },
  //     msg: {},
  //     label: "city",
  //   },
  //   itemProps: {
  //     itemType: "autoComplete",
  //     fetchObjs: { api: "/Citas", flag: "Citas" },
  //     optionLabel: "code",
  //     optionValue: "_id",
  //     disabled: false,
  //     sx: { width: "100%" },
  //   },
  // },
  // {
  //   formProps: { gridSize: 6 },
  //   general: {
  //     field: "Cita",
  //     rules: {
  //       required: true,
  //       // //length: { min: 4, max: 16 },
  //       type: "string",
  //     },
  //     label: "Cita",
  //   },
  //   itemProps: {
  //     itemType: "input",
  //     type: "text",
  //     disabled: false,
  //     sx: { width: "100%" },
  //   },
  // },
];

const shopFormImg = {
  type: "image",
  hidden: false,
  disabled: false,
  accept: "image/*",
  multiple: false,
  message: "onlyImage",
};
export default shopFormInputs;
export { shopFormImg };
