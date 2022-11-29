import React, { useState, useEffect } from "react";
import loginFormProps from "../../../config/general/auth/loginConf";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../../../redux/authSlice";
import { Container, Grid, Paper, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormItem from "../../../component/form/FormItem";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import { useTranslation } from "react-i18next";
import { homePage } from "../../../config/general/router/routerConf";

export default function Login() {
  //conf
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //state
  const [formValue, setFormValue] = useState({});
  const [logggedIn, setLogggedIn] = useState(false);
  const [warning, setWarning] = useState("");
  //selector
  const loginStatus = useSelector((state) => state.auth.loginStatus);
  const errMsg = useSelector((state) => state.auth.errMsg);
  const view = useSelector((state) => state.root.view);
  //func
  const handleChange = (field) => (value) => {
    setFormValue((prev) => ({ ...prev, [field]: value }));
  };

  const isMB = view === "MB";
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchLogin(formValue));
    setLogggedIn(true);
  };

  // useEffect(() => {
  //   const DNS = localStorage.getItem("DNS");
  //   setFormValue((prev) => ({ ...prev, DNS }));
  // }, []);

  useEffect(() => {
    if (logggedIn) {
      if (loginStatus === "succeed") {
        // navigate("/", { replace: true });
        navigate(homePage);
        // window.location.reload();
        // window.location.replace("/");
      } else if (loginStatus === "error" && errMsg === 400) {
        setWarning("Invalid Username Or Password");
      }
    }
  }, [errMsg, logggedIn, loginStatus, navigate]);
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        p: 0,
      }}
    >
      <Paper
        sx={{
          width: { xs: "100%", md: 500 },
          maxHeight: 600,
          minHeight: 450,
          borderRadius: "10px",
        }}
        elevation={24}
      >
        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={3} padding={5}>
            <Grid item xs={12}>
              <Typography
                align={"center"}
                variant="h5"
                sx={{ pt: 3, fontWeight: 700 }}
              >
                {/* PLEASE LOG IN */}
                {t("auth.plzLogin")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="error.main" align="center">
                {warning || errMsg}
              </Typography>
            </Grid>
            {loginFormProps.map((inputProps) => {
              const { formProps, general, itemProps } = inputProps;
              const { field, subField, label, ...generalRest } = general;
              const show = !formProps.isShow || formProps.isShow();
              return (
                show && (
                  <Grid
                    item
                    xs={formProps?.gridSize || 12}
                    key={general?.field}
                    sx={{ p: 1 }}
                  >
                    <FormItem
                      label={label ? label : t(`auth.${field}`)}
                      {...itemProps}
                      {...generalRest}
                      value={
                        formValue[general?.field] ?? "" //uncontroled to controled?
                      }
                      handleChange={handleChange(general?.field)}
                    />
                  </Grid>
                )
              );
            })}
            <Grid container item xs={12} justifyContent="center" sx={{ pb: 5 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: 400, mt: 3 }}
              >
                {t("auth.login")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
