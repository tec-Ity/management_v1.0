import React from "react";
import FormInput from "./FormInput.jsx";
import FormAutoComplete from "./FormAutoComplete.jsx";
import FormCheckBox from "./FormCheckBox.jsx";
export default function FormItem({ itemType, ...rest }) {
  const items = {
    input: FormInput,
    autoComplete: FormAutoComplete,
    //switch:..
    checkBox: FormCheckBox,
  };
  const Item = items[itemType];
  return <Item {...rest} />;
}
