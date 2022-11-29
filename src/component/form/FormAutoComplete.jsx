import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Autocomplete,
  createFilterOptions,
  Chip,
} from "@mui/material";
import CusPostModal from "../modal/CusPostModal.jsx";
import { getObjects, selectObjects, setQuery } from "../../redux/fetchSlice";
import { t } from "i18next";
import debounce from "../../utils/debounce/debounce.js";
import ErrorSnackBar from "../popover/ErrorSnackBar.jsx";

const filter = createFilterOptions();

export default function FormAutoComplete({
  fetchObjs,
  label,
  value,
  optionLabel = "code",
  optionValue = "_id",
  rules,
  handleChange,
  size = "medium",
  variant,
  freeSolo = false,
  multiple = false,
  isAddNew,
  newFormInputs,
  newFetchObj,
  ...rest
}) {
  const dispatch = useDispatch();
  const stringifyValue = String(value);
  const objects = useSelector(selectObjects(fetchObjs.flag));
  const getStatus = useSelector((state) => state.fetch.getStatus);
  const [selectedValue, setSelectedValue] = useState(value);
  const initiated = React.useRef(false);
  const [inputValue, setInputValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  // console.log(
  //   11111111111111,
  //   label,
  //   value,
  //   selectedValue,
  //   showAddModal,
  //   optionValue,
  //   optionLabel,
  //   objects,
  //   selectedValue ?? value
  // );
  //init fetch
  useEffect(() => {
    if (
      getStatus !== "loading" &&
      !objects?.find(
        (i) =>
          i &&
          value &&
          (i[optionValue] === value ||
            i === value ||
            i[optionValue] === value[optionValue])
      )
    ) {
      // if ((!objects || objects.length === 0) && getStatus !== "loading") {
      // console.log("init fetch", label, value);
      dispatch(
        setQuery({
          fetchObjs,
          query: {
            search: multiple ? "" : value ? value[optionLabel] || value : "",
          },
        })
      );
      dispatch(getObjects({ fetchObjs }));
    }
  }, [dispatch, fetchObjs, stringifyValue]);

  //init selected value
  useEffect(() => {
    // if (initiated.current) return;
    // if (!(objects.length > 0 && value)) return;

    // console.log("init selected");
    const initValue = objects.find(
      (i) =>
        i &&
        value &&
        (i[optionValue] === value ||
          i === value ||
          i[optionValue] === value[optionValue])
    );
    // console.log("init value", label, value, initValue);
    initValue && setSelectedValue(initValue);
    initiated.current = true;
  }, [objects, value]);

  const onInputChange = (e, inputVal) => {
    // console.log(11111111111111, e, inputVal);
    if (e && e.type === "change") {
      // console.log("new query");
      dispatch(setQuery({ fetchObjs, query: { search: inputVal } }));
      dispatch(getObjects({ fetchObjs }));
    }
  };

  const onChange = (e, val, reason) => {
    console.log("onChange", e, val, reason);
    // dispatch(
    //   setQuery({ fetchObjs, query: { search: val?.[optionLabel] || "" } })
    // );
    // dispatch(getObjects({ fetchObjs }));
    // console.log(2222222222222, e, val, optionValue);
    if (
      isAddNew &&
      val &&
      (val?.isNewOption || //single value
        (multiple && val[val.length - 1]?.isNewOption)) //multiple value
    ) {
      setShowAddModal(true);
    } else {
      if (multiple) {
        // let valToPass = [
        //   ...val,
        //   (val && val[val.length - 1][optionValue]) || null,
        // ];
        handleChange(val?.map((v) => v[optionValue]));
      } else {
        console.log(1010101010, val, val[optionValue]);
        handleChange((val && val[optionValue]) || null);
      }
      setSelectedValue(val);
    }
  };

  const handleClose = (e, reason) => {
    if (reason !== "blur") return;
    dispatch(
      setQuery({
        fetchObjs,
        query: { search: selectedValue?.[optionLabel] || "" },
      })
    );
    dispatch(getObjects({ fetchObjs }));
  };

  //helper
  const removeDuplicates = (options) => {
    const newOptions = [];
    const optionValueCheckObj = {};
    const optionLabelCheckObj = {};
    options.forEach((option) => {
      const isDuplicate =
        optionValueCheckObj[option[optionValue]] ||
        optionLabelCheckObj[option[optionLabel]];
      if (!isDuplicate) {
        optionValueCheckObj[option[optionValue]] = true;
        optionLabelCheckObj[option[optionLabel]] = true;
        newOptions.push(option);
      }
    });
    // console.log("newOptions", newOptions);
    return newOptions || [];
  };

  const handleBlur = (e) => {
    // console.log("onBlur", inputValue, selectedValue);
    // if (freeSolo && inputValue && !selectedValue) {
    //   // console.log("");
    //   setError("请选择或添加一个选项");
    //   setInputValue("");
    //   handleChange("");
    // } else setError(null);
    // if (freeSolo && inputValue && !isAddNew) {
    //   //   setSelectedValue({
    //   //     [optionValue]: inputValue,
    //   //     [optionLabel]: inputValue,
    //   //   });
    //   handleChange(inputValue);
    // }
  };

  return (
    <>
      {objects && (
        <Autocomplete
          size={size || "medium"}
          loading={getStatus === "loading"}
          value={
            multiple && selectedValue.length === 0
              ? value
              : selectedValue || value
          }
          // inputValue={value[optionLabel]}
          clearOnBlur
          onChange={onChange}
          onClose={handleClose}
          onBlur={handleBlur}
          freeSolo={freeSolo}
          multiple={multiple}
          // inputValue={inputValue}
          onInputChange={debounce(onInputChange, 100)}
          getOptionLabel={(option) => {
            // console.log("getOptionLabel", label, option);
            return option[optionLabel] || "";
          }}
          isOptionEqualToValue={(option, value) => {
            // console.log("isOptionEqualToValue", option, value);
            // if (multiple)
            //   return (
            //     option[optionValue] === value[optionValue] ||
            //     option[optionValue] === value
            //   );
            // else
            return (
              option[optionValue] === value ||
              option[optionValue] === value[optionValue] ||
              option === value
            );
          }}
          options={removeDuplicates(objects)}
          filterOptions={(options, params) => {
            // console.log("filter", options, params);
            let filtered = filter(options, params);
            filtered = removeDuplicates(filtered);
            const { inputValue } = params;
            const isExisting = options?.some(
              (option) =>
                inputValue?.toUpperCase() === option[optionLabel]?.toUpperCase()
            );
            // console.log(1111, inputValue, isExisting, filtered);
            // only in free solo
            if (freeSolo && inputValue !== "" && !isExisting) {
              filtered.push({
                [optionValue]: inputValue,
                [optionLabel]: isAddNew ? `添加 "${inputValue}"` : inputValue,
                isNewOption: true,
              });
              setInputValue(inputValue);
              // isAddNew && setInputValue(inputValue);
            }

            // console.log(filtered);
            return filtered;
          }}
          renderTags={(tagVal, getTagProps) => {
            // console.log("renderTags", tagVal);
            // console.log(tagVal, getTagProps);
            if (multiple)
              return tagVal.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option[optionLabel]}
                  {...getTagProps({ index })}
                />
              ));
          }}
          {...rest}
          renderInput={(params) => (
            <TextField
              label={label}
              autoComplete="off"
              variant={variant || "standard"}
              required={rules?.required}
              {...params}
            />
          )}
        />
      )}
      {isAddNew && newFetchObj && newFormInputs && (
        <CusPostModal
          open={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setInputValue("");
          }}
          title={"添加" + label}
          showCloseIcon={false}
          formInputs={newFormInputs}
          fetchObj={newFetchObj}
          // set optionLable as key of defaultValue since optionValue should be _id
          defaultValue={{ [optionLabel]: inputValue, Firm: "Supplier" }}
          activeSubmitButton={false}
          handleCancel={() => !multiple && setSelectedValue(value)}
          submittedCallback={(newObj) => {
            let newVal = {
              [optionValue]: newObj[optionValue],
              [optionLabel]: newObj[optionLabel],
            };
            if (multiple) {
              setSelectedValue((prev) => [...prev, newVal]);
              // handleChange(selectedValue)
            } else {
              setSelectedValue(newVal);
              handleChange(newObj[optionValue]);
            }
            setInputValue("");
          }}
        />
      )}
    </>
  );
}
