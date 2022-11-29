import userConf from "./userConf";
import shopConf from "../shop/shopConf.js";
const userFormInputs = [
  ///////id
  {
    formProps: { gridSize: 6, isShow: () => false },
    general: {
      field: "_id",
      label: "id",
    },
    itemProps: {
      itemType: "input",
      type: "text",
      disabled: false,
      sx: { width: "100%" },
    },
  },
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
  /////////pwd
  {
    formProps: { gridSize: 6 },
    general: {
      field: "pwd",
      rules: {
        required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "pwd",
    },
    itemProps: {
      itemType: "input",
      type: "pwd",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  /////////role
  {
    formProps: {
      gridSize: 6,
      isShow: ({ formValue }) => {
        const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
        return formValue._id === userId ? false : true;
      },
    },
    general: {
      field: "role",
      rules: {
        required: true,
        // //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "role",
    },
    itemProps: {
      itemType: "input",
      type: "select",
      disabled: false,
      sx: { width: "100%" },
      getOptions: () => {
        try {
          const userRole = JSON.parse(localStorage.getItem("userInfo")).role;
          const roleOptions = [];
          for (const key in userConf.role) {
            if (Object.hasOwnProperty.call(userConf.role, key)) {
              const role = userConf.role[key];
              //if cur user has higher auth
              if (parseInt(userRole) < parseInt(key)) {
                roleOptions.push({ value: key, label: role });
              }
            }
          }
          return roleOptions;
        } catch (err) {
          console.log(err);
        }
      },
      // options: Object.keys(userConf.role).map((key) => {
      //   console.log(userRole, key, parseInt(userRole) < parseInt(key));
      //   return (
      //     parseInt(userRole) < parseInt(key) && {
      //       value: key,
      //       label: userConf.role[key],
      //     }
      //   );
      // }),
    },
  },
  /////////shop
  {
    formProps: {
      gridSize: 6,
      isShow: ({ formValue }) => {
        const userId = JSON.parse(localStorage.getItem("userInfo"))._id;
        return formValue._id === userId
          ? false
          : formValue?.role > 100
          ? true
          : false;
      },
    },
    general: {
      field: "Shop",
      rules: {
        required: false,
        // //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "shop",
    },
    itemProps: {
      itemType: "autoComplete",
      fetchObjs: shopConf.fetchObjs,
      optionLabel: "nome",
      optionValue: "_id",
      disabled: false,
      sx: { width: "100%" },
    },
  },
];

const userFormImg = {
  type: "image",
  hidden: false,
  disabled: false,
  accept: "image/*",
  multiple: false,
  message: "onlyImage",
};

const userPwdFormInputs = [
  {
    formProps: {
      gridSize: 6,
      isShow: ({ formValue }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const { _id, role } = userInfo;
        return formValue._id === _id ? true : role === 101 ? false : true;
      },
    },
    general: {
      field: "pwdOrg",
      rules: {
        // required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "pwdOrg",
    },
    itemProps: {
      itemType: "input",
      type: "pwd",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "pwd",
      rules: {
        required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "pwd",
    },
    itemProps: {
      itemType: "input",
      type: "pwd",
      disabled: false,
      sx: { width: "100%" },
    },
  },
  {
    formProps: { gridSize: 6 },
    general: {
      field: "pwdConfirm",
      rules: {
        required: true,
        //length: { min: 4, max: 16 },
        type: "string",
      },
      label: "pwdConfirm",
    },
    itemProps: {
      itemType: "input",
      type: "pwd",
      disabled: false,
      sx: { width: "100%" },
    },
  },
];

export default userFormInputs;
export { userFormImg, userPwdFormInputs };
