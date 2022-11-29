const defaultRules = { required: true, type: "string" };
const defaultItemProps = { itemType: "input", type: "text" };
const invoiceFormInputs = [
  {
    group: "basic",
    groupTitle: "basic",
    inputs: [
      {
        general: {
          field: "nome",
          label: "nome",
          rules: defaultRules,
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "receiverCode",
          label: "receiverCode",
          rules: defaultRules,
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "emailLaw",
          label: "emailLaw",
          rules: {
            required: false,
            type: "email",
          },
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "pIva",
          label: "pIva",
          rules: defaultRules,
        },
        itemProps: defaultItemProps,
      },
    ],
  },
  {
    group: "address",
    groupTitle: "address",
    inputs: [
      {
        general: {
          field: "country",
          label: "country",
          rules: defaultRules,
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "province",
          label: "province",

          rules: {
            ...defaultRules,
            required: false,
            length: { min: 2, max: 2 },
          },
        },
        itemProps: { ...defaultItemProps, placeholder: "ex: MI, TO, FI..." },
      },
      {
        general: {
          field: "city",
          label: "city",
          rules: defaultRules,
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "address",
          label: "address",
          rules: defaultRules,
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "zip",
          label: "zip",
          rules: { defaultRules, required: false },
        },
        itemProps: defaultItemProps,
      },
    ],
  },
  {
    group: "contact",
    groupTitle: "contact",
    inputs: [
      {
        general: {
          field: "contact",
          label: "contact",
          rules: {
            required: false,
            type: "string",
          },
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "email",
          label: "email",
          rules: {
            required: false,
            type: "email",
          },
        },
        itemProps: defaultItemProps,
      },
      {
        general: {
          field: "phone",
          label: "phone",
          rules: {
            required: false,
            type: "string",
          },
        },
        itemProps: defaultItemProps,
      },
    ],
  },
];

export default invoiceFormInputs;
