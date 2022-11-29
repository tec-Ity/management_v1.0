import SupplierConf from "../supplier/supConf";
import SupplierFormInputs from "../supplier/supFormInputs";
import categConf from "../category/categConf";
import categFormInputs from "../category/categFormInputs";

const getSetting = (type) => {
  const shopInfo = JSON.parse(localStorage.getItem("userInfo"))?.Shop;
  if (shopInfo && type) return shopInfo[type];
};

const prodFormInputs = [
  {
    group: "info",
    inputs: [
      //code
      {
        formProps: {
          gridSize: 6,
        },
        general: {
          field: "code",
          rules: {
            required: true,
            length: { min: 2, max: 20 },
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
      //supplier
      {
        formProps: {
          gridSize: 6,
          isShow: () => getSetting("allow_Supplier"),
        },
        general: {
          field: "Supplier",
          rules: {
            required: false,
            // //length: { min: 4, max: 16 },
            type: "string",
          },
          label: "Supplier",
        },
        itemProps: {
          itemType: "autoComplete",
          fetchObjs: SupplierConf.fetchObjs,
          freeSolo: true,
          isAddNew: true,
          newFormInputs: SupplierFormInputs,
          newFetchObj: SupplierConf.fetchObj,
          optionLabel: "code",
          optionValue: "_id",
          disabled: false,
          sx: { width: "100%" },
        },
      },
    ],
  },
  {
    group: "name",
    inputs: [
      ///name
      {
        formProps: {
          gridSize: 6,
          isShow: () => !getSetting("is_Pnome"),
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
      // Pnome
      {
        formProps: {
          gridSize: 6,
          isShow: () => getSetting("is_Pnome"),
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
          itemType: "autoComplete",
          // itemType: "input",
          freeSolo: true,
          fetchObjs: {
            flag: "pnomes",
            api: "/Pnomes",
          },
          type: "text",
          disabled: false,
          optionLabel: "code",
          optionValue: "code",
          sx: { width: "100%" },
        },
      },
      /////////nameTR
      {
        formProps: { gridSize: 6 },
        general: {
          field: "nomeTR",
          rules: {
            // required: true,
            //length: { min: 2, max: 16 },
            type: "string",
          },
          label: "nomeTR",
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
          field: "Categs",
          rules: {
            // required: true,
            //length: { min: 2, max: 16 },
            type: "array",
          },
          type: "array",
          label: "Categs",
        },
        itemProps: {
          itemType: "autoComplete",
          fetchObjs: categConf.fetchObjs,
          freeSolo: true,
          multiple: true,
          isAddNew: true,
          newFormInputs: categFormInputs,
          newFetchObj: categConf.fetchObj,
          optionLabel: "nome",
          optionValue: "_id",
          disabled: false,
          sx: { width: "100%" },
        },
      },
    ],
  },
  {
    group: "price",
    getInfo: (formValues) =>
      formValues?.is_simple === false &&
      "此商品为多规格商品，以下价格仅作为参考，最终价格以规格商品为准",
    infoColor: "warning.main",
    inputs: [
      //////////price sale
      {
        formProps: { gridSize: 12, gridSizeXl: 12 },
        general: {
          field: "price_sale",
          rules: {
            required: true,
            type: "float",
          },
          label: "price_sale",
        },
        itemProps: {
          itemType: "input",
          type: "price",
          hasDiscount: true,
          discountDefaultPriceField: "price_regular",
          sx: { width: "100%" },
          disabled: false,
        },
      },
      /////////price regular
      {
        formProps: { gridSize: 6, asValue: "price_sale" },
        general: {
          field: "price_regular",
          rules: {
            type: "float",
          },
          label: "price_regular",
        },
        itemProps: {
          itemType: "input",
          type: "price",
          sx: { width: "100%" },
          disabled: false,
        },
      },
      /////////price cost
      {
        formProps: { gridSize: 6 },
        general: {
          field: "price_cost",
          rules: {
            required: false,
            type: "float",
          },
          label: "price_cost",
        },
        itemProps: {
          itemType: "input",
          type: "price",
          sx: { width: "100%" },
          disabled: false,
        },
      },
      {
        formProps: { gridSize: 6 },
        general: {
          field: "iva",
          rules: {
            required: false,
            type: "float",
          },
          label: "iva",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          sx: { width: "100%" },
          disabled: false,
        },
      },
    ],
  },
  {
    group: "other",
    inputs: [
      /////////unit
      {
        formProps: { gridSize: 6 },
        general: {
          field: "unit",
          rules: {
            // required: true,
            type: "string",
          },
          label: "unit",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
        },
      },
      /////////weight
      {
        formProps: { gridSize: 6 },
        general: {
          field: "weight",
          rules: {
            // required: true,
            type: "float",
          },
          label: "weight",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
          endAdornment: "KG",
        },
      },
      /////////quantity
      {
        formProps: { gridSize: 6 },
        general: {
          field: "quantity",
          rules: {
            // required: true,
            type: "int",
          },
          label: "quantity",
        },
        itemProps: {
          itemType: "input",
          type: "text",
          disabled: false,
          sx: { width: "100%" },
          // endAdornment: "KG",
        },
      },
      {
        formProps: { gridSize: 6 },
        general: {
          field: "is_quick",
          rules: {},
          msg: {},
          label: "is_express",
        },
        itemProps: {
          itemType: "checkBox",
          disabled: false,
          sx: { width: "100%" },
        },
      },
    ],
  },

  //////////categ
  //   {
  //     formProps: { gridSize: 6 },
  //     general: {
  //       field: "categ",
  //       rules: {
  //         required: false,
  //         type: "id",
  //       },
  //       label: "Category",
  //     },
  //     itemProps: {
  //       itemType: "input",
  //       //   flagSlice: "categ",
  //       type: "text",
  //       sx: { width: "100%" },
  //       disabled: false,
  //     },
  //   },
  //   //////////brand
  //   {
  //     formProps: { gridSize: 6 },
  //     general: {
  //       field: "brand",
  //       rules: {
  //         required: false,
  //         type: "id",
  //       },
  //       label: "Brand",
  //     },
  //     itemProps: {
  //       itemType: "input",
  //       //   flagSlice: "brand",
  //       type: "text",
  //       sx: { width: "100%" },
  //       disabled: false,
  //     },
  //   },
  //   //////////shop
  //   {
  //     formProps: { gridSize: 6 },
  //     general: {
  //       field: "Shop",
  //       rules: {
  //         required: false,
  //         type: "id",
  //       },
  //       label: "Shop",
  //     },
  //     itemProps: {
  //       itemType: "input",
  //       //   flagSlice: "brand",
  //       type: "text",
  //       sx: { width: "100%" },
  //       disabled: false,
  //     },
  //   },
];

const prodFormImg = {
  type: "image",
  hidden: false,
  disabled: false,
  accept: "image/*",
  multiple: false,
  message: "onlyImage",
};
export default prodFormInputs;
export { prodFormImg };
