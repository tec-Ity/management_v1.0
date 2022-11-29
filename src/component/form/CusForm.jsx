import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
} from "react";
//mui
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormUpload from "./FormUpload.jsx";
//component
import FormItem from "./FormItem";
import CusModal from "../modal/CusModal.jsx";
import { Divider, Box, Typography, Card } from "@mui/material";
import { useSelector } from "react-redux";
import ConfirmDeleteDialog from "../modal/ConfirmDeleteDialog.jsx";
import { t } from "i18next";
import CusH6 from "../typography/CusH6.jsx";
export default function CusForm({
  handleSubmit,
  handleCancel,
  handleDelete,
  formInputs,
  submitStatus,
  fileInput,
  defaultValue = {}, //obj
  hiddenField = [],
  formType = "POST",
  activeSubmitButton = true,
  clearAfterSubmit = true,
  initModify = true,
  clearOnCancel = true,
  showTopModifyButton = false,
  showFormGroup = false,
}) {
  const DNS = useSelector((state) => state.auth.DNS);
  const view = useSelector((state) => state.root.view);
  const isMB = view === "MB";
  //state
  const [formValue, setFormValue] = useState({}); //to slice
  //   const [formWarning, setFormWarning] = useState({});
  const [showFormAlert, setShowFormAlert] = useState(false);
  const [formAlertMsg, setFormAlertMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showImgUpload, setShowImgUpload] = useState(false);
  const [modifying, setModifying] = useState(initModify);
  const [showDelete, setShowDelete] = useState(false);
  // console.log(formValue);
  //func
  const handleChange = useCallback(
    (field, subField) => (val) => {
      if (!subField)
        setFormValue((prev) => ({
          ...prev,
          [field]: val,
        }));
      else
        setFormValue((prev) => ({
          ...prev,
          [field]: {
            ...(prev[field] && typeof prev[field] === "object"
              ? prev[field]
              : {}),
            [subField]: val,
          },
        }));
    },
    []
  );
  // console.log(formValue);
  function handleSubmitSelf(e) {
    e?.preventDefault();
    const checkResult = formCheck(formInputs, formValue);
    const { allowSubmit, alertMsg, updateFormValue } = checkResult;
    if (allowSubmit === false) {
      setShowFormAlert(true);
      setFormAlertMsg(alertMsg || "Form Validation Error, please try again.");
    }
    if (allowSubmit === true) {
      handleSubmit({ ...formValue, ...updateFormValue });
      setSubmitted(true);
    }
  }

  function handleCancelSelf() {
    setModifying(false);
    clearOnCancel ? setFormValue({}) : setFormValue(defaultValue);
    handleCancel && handleCancel();
  }

  function formCheck(formObjs, formValue) {
    try {
      let allowSubmit = true;
      let alertMsg = "";
      let updateFormValue = {};
      let newFormObjs = [];
      formObjs.forEach((obj) => {
        if (obj.group) newFormObjs = [...newFormObjs, ...obj.inputs];
        else newFormObjs.push(obj);
      });
      const setAlert = (label, msg) => {
        if (label) {
          allowSubmit = false;
          alertMsg += t(`formField.${label}`) + msg + " ";
        }
      };

      newFormObjs.forEach((item) => {
        const { rules, field, label } = item.general;
        const { isShow, asValue } = item.formProps || {};
        const show =
          (!isShow || isShow({ formValue, formType })) &&
          hiddenField.indexOf(field) === -1;
        const skip = !show;
        if (!skip && rules && Object.keys(rules).length !== 0) {
          let msgSet = false;
          const value = formValue[field];
          //check each rule for one filed
          for (const key in rules) {
            if (Object.hasOwnProperty.call(rules, key)) {
              const rule = rules[key];
              switch (key) {
                case "required":
                  if (rule === true && !value) {
                    setAlert(label, "必填");
                    msgSet = true;
                  }
                  break;
                case value && "length":
                  if (rule.min && rule.max) {
                    if (
                      !(value.length >= rule.min && value.length <= rule.max)
                    ) {
                      setAlert(label, `长度必须在${rule.min}-${rule.max}位`);
                      msgSet = true;
                    }
                  } else if (rule.min) {
                    //////
                  }
                  break;
                case value && "type":
                  if (rule === "float") {
                    let pattern = /\d*[,.]\d{0,2}|\d*/;
                    const res = pattern.test(value);
                    if (res) {
                      const newFloat = isNaN(value)
                        ? parseFloat(value.replace(",", "."))
                        : parseFloat(value);
                      updateFormValue[field] = newFloat;
                    } else {
                      setAlert(label, "必须为小数");
                    }
                  }
                  break;
                default:
                  break;
              }
              if (msgSet) break; //break for loop for rules after matching on rule
            }
          }
          //clear warning after next submit
          if (!msgSet) setAlert(null);
          if (asValue && !value) {
            updateFormValue[field] = formValue[asValue];
          }
        }
      });
      // if (alertMsg) alertMsg += "错误";
      return { allowSubmit, alertMsg, updateFormValue };
    } catch (err) {
      console.log(err);
    }
  }

  //effect
  //init
  useEffect(() => {
    if (Object.keys(defaultValue).length > 0) {
      const valueTemp = { ...defaultValue };
      hiddenField.forEach((field) => delete valueTemp[field]);
      setFormValue(valueTemp);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (submitted === true && submitStatus === "succeed") {
      clearAfterSubmit && setFormValue({});
      setSubmitted(false);
      setModifying(false);
    }
  }, [submitStatus, submitted]);

  //memo
  //pure file component
  const fileInputMemo = useMemo(
    () => (
      <FormUpload
        {...fileInput}
        handleChange={(isSmall, imgs) =>
          handleChange(isSmall ? "imageSmall" : "image")(imgs)
        }
      />
    ),
    [fileInput, handleChange]
  );

  const generateInputs = (inputs) => {
    return inputs?.map((inputProps, index) => {
      const {
        formProps,
        general,
        itemProps,
        group,
        groupTitle,
        getInfo,
        infoColor,
        inputs: groupInputs,
      } = inputProps;
      if (group) {
        if (isMB || showFormGroup) {
          const info = getInfo && getInfo(formValue);
          return (
            <Card
              key={group}
              elevation={3}
              sx={{ width: "100%", p: { xs: 1, md: 3 }, my: 2 }}
            >
              {groupTitle && (
                <Grid item xs={12}>
                  <CusH6 type="primary">{t(`formGroup.${groupTitle}`)}</CusH6>
                </Grid>
              )}
              {info && (
                <Grid item xs={12}>
                  <Typography
                    sx={{ color: infoColor }}
                    variant="overline"
                    lineHeight="1em"
                  >
                    *{info}
                  </Typography>
                </Grid>
              )}
              <Grid item container xs={12}>
                {generateInputs(groupInputs)}
              </Grid>
            </Card>
          );
        } else return generateInputs(groupInputs);
      }
      const { field, subField, label, type, ...generalRest } = general;
      const show =
        (!formProps?.isShow || formProps?.isShow({ formValue, formType })) &&
        hiddenField.indexOf(field) === -1;
      if (show) {
        let value;
        if (field && formValue[field]) {
          if (subField && typeof formValue[field] === "object")
            value = formValue[field][subField];
          else value = formValue[field];
        } else {
          if (type === "array") value = [];
          else value = "";
        }

        let discountDefaultPrice;
        if (itemProps.hasDiscount && itemProps.discountDefaultPriceField) {
          discountDefaultPrice = formValue[itemProps.discountDefaultPriceField];
        }

        return (
          <Grid
            item
            xs={12}
            md={formProps?.gridSize || 6}
            xl={formProps?.gridSizeXl || 4}
            key={field + subField + index}
            sx={{ p: 1, display: formProps?.hidden && "none" }}
          >
            <FormItem
              label={t(`formField.${label}`)}
              {...itemProps}
              {...(discountDefaultPrice ? { discountDefaultPrice } : {})}
              disabled={!modifying || itemProps.disabled}
              {...generalRest}
              value={value}
              handleChange={handleChange(field, subField)}
            />
          </Grid>
        );
      } else return <Fragment key={general?.field + "hidden"}></Fragment>;
    });
  };

  return (
    <>
      <form onSubmit={handleSubmitSelf}>
        <Grid container>
          {showTopModifyButton && (
            <Grid container item xs={12} sx={{ display: { md: "none" } }}>
              <ButtonGroup
                modifying={modifying}
                handleDelete={handleDelete}
                setShowDelete={setShowDelete}
                handleCancelSelf={handleCancelSelf}
                activeSubmitButton={activeSubmitButton}
                handleSubmitSelf={handleSubmitSelf}
                setModifying={setModifying}
              />
            </Grid>
          )}
          <Grid item xs={12} sx={{ height: 10 }} />
          {modifying && (
            <>
              {/* img buttons */}
              {fileInput && formType !== "POST" && (
                <Grid item xs={12} sx={{ pb: 2 }}>
                  {showImgUpload ? (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mb: 2 }}
                      onClick={() => {
                        setShowImgUpload(false);
                        handleChange("image")([]);
                        handleChange("imageSmall")([]);
                      }}
                    >
                      取消修改
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setShowImgUpload(true)}
                    >
                      修改图片
                    </Button>
                  )}
                </Grid>
              )}
              {/* img upload section */}
              {fileInput && (showImgUpload || formType === "POST") && (
                <>
                  <Grid item xs={12}>
                    {fileInputMemo}
                  </Grid>
                  <Grid item xs={12} sx={{ pb: 1 }}>
                    <Divider />
                  </Grid>
                </>
              )}
            </>
          )}
          {/* default img list */}
          <Grid container item xs={12}>
            {showImgUpload && (
              <Grid item xs={12}>
                原始图片：
              </Grid>
            )}
            {formValue.img_xs && (
              <Grid item>
                <Box
                  component="img"
                  src={DNS + formValue.img_xs}
                  sx={{ height: 100, width: 100 }}
                />
              </Grid>
            )}
            <Grid item xs={12} sx={{ py: 1 }}>
              <Divider />
            </Grid>
          </Grid>

          {/* {(formValue.img_urls || formValue.img_url) && (
            <Grid container item xs={12}>
              {formValue.img_urls?.map((img, index) => (
                <Grid item key={index}>
                  <Box
                    component="img"
                    src={DNS + img}
                    sx={{ height: 100, width: 100 }}
                  />
                </Grid>
              ))}
              {formValue.img_url && (
                <Grid item>
                  <Box
                    component="img"
                    src={DNS + formValue.img_url}
                    sx={{ height: 100, width: 100 }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          )} */}
          {generateInputs(formInputs)}
          <ButtonGroup
            modifying={modifying}
            handleDelete={handleDelete}
            setShowDelete={setShowDelete}
            handleCancelSelf={handleCancelSelf}
            activeSubmitButton={activeSubmitButton}
            handleSubmitSelf={handleSubmitSelf}
            setModifying={setModifying}
          />
        </Grid>
      </form>
      <CusModal
        open={showFormAlert}
        onClose={() => setShowFormAlert(false)}
        hideBackdrop
        size="xs"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{formAlertMsg}</Typography>
          <Button variant="contained" onClick={() => setShowFormAlert(false)}>
            OK
          </Button>
        </Box>
      </CusModal>
      <ConfirmDeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        handleDelete={() => {
          setShowDelete(false);
          handleDelete();
        }}
      />
    </>
  );
}

function ButtonGroup({
  modifying,
  handleDelete,
  setShowDelete,
  handleCancelSelf,
  activeSubmitButton,
  handleSubmitSelf,
  setModifying,
}) {
  return (
    <Grid
      item
      xs={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pt: 2,
      }}
    >
      {modifying ? (
        <>
          {handleDelete && (
            <Button
              variant="contained"
              sx={{ mr: 3 }}
              color="error"
              onClick={setShowDelete}
            >
              {t("general.delete")}
            </Button>
          )}
          <Button variant="outlined" sx={{ mr: 3 }} onClick={handleCancelSelf}>
            {t("general.cancel")}
          </Button>
          <Button
            type={activeSubmitButton ? "submit" : "button"}
            variant="contained"
            color="success"
            onClick={() => {
              !activeSubmitButton && handleSubmitSelf();
              // setModifying(false);
            }}
          >
            {t("general.submit")}
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={() => setModifying(true)}>
          {t("general.modify")}
        </Button>
      )}
    </Grid>
  );
}
