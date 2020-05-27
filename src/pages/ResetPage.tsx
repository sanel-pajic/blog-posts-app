import React, { useState, useContext } from "react";
import {
  Typography,
  Divider,
  Theme,
  createStyles,
  makeStyles,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { RESET_EMAIL_MUTATION } from "../graphql-queries-mutations/mutations";
import * as yup from "yup";
import Alert from "@material-ui/lab/Alert";
import { BootstrapInput } from "./ForgotPage";
import { store } from "../components/store";
import { useHistory } from "react-router-dom";
import { CircularLoading } from "../components/CircularLoading";
import { USERS_QUERY } from "../graphql-queries-mutations/queries";
import { CurrentUserContext } from "../App";

let schema = yup.object().shape({
  newPassword: yup.string().required("Password is required!").min(5),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match!"),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      width: "100%",
      marginTop: "1%",
    },
    formControlMedia: { width: "100%", marginTop: "5%", marginBottom: "1%" },
    buttonUpdate: {
      width: 160,
      textTransform: "none",
      marginTop: "1.5%",
    },
    buttonUpdateMedia: { width: 160, textTransform: "none", marginTop: "5%" },
    snackbar: {
      display: "flex",
      marginTop: "2vh",
      justifyContent: "center",
      alignItems: "center",
    },
    rootDiv: {
      width: "80%",
      paddingLeft: "10%",
      paddingRight: "5%",
      paddingTop: "2%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100%",
      marginBottom: "12.7%",
    },
    rootDivMedia: {
      width: "80%",
      paddingLeft: "10%",
      paddingRight: "5%",
      paddingTop: "2%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100%",
      marginBottom: "12.7%",
      marginTop: "8%",
    },
    divider: {
      width: "100%",
      marginTop: "1%",
      marginBottom: "1%",
    },
    inputLabel: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 5,
    },
    alert: { display: "flex", justifyContent: "center", alignItems: "center" },
  })
);

export const ResetPage: React.FC = () => {
  const classes = useStyles();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const resetToken = localStorage.getItem("resetToken");
  const history = useHistory();
  const { setAuthorized } = useContext(CurrentUserContext);
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [resetEmailMutation, { error }] = useMutation(RESET_EMAIL_MUTATION, {
    errorPolicy: "all",
  });

  if (loading || !data) {
    return <CircularLoading />;
  }

  return (
    <div className={matches ? classes.rootDiv : classes.rootDivMedia}>
      {!success ? (
        error &&
        error.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <Alert
              color="error"
              variant="filled"
              className={matches ? undefined : classes.alert}
            >
              {message}
            </Alert>
          </div>
        ))
      ) : (
        <Alert
          color="success"
          variant="filled"
          className={matches ? undefined : classes.alert}
        >
          {alertMessage}
        </Alert>
      )}

      <Typography variant="h5" style={{ marginTop: "1 %" }}>
        Reset Password
      </Typography>
      <Divider className={classes.divider} />

      <FormControl
        className={matches ? classes.formControl : classes.formControlMedia}
      >
        <InputLabel
          shrink
          htmlFor="new-password-input"
          className={classes.inputLabel}
        >
          New Password
        </InputLabel>
        <BootstrapInput
          placeholder="New Password *"
          id="new-password-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormControl>
      <FormControl
        className={matches ? classes.formControl : classes.formControlMedia}
      >
        <InputLabel
          shrink
          htmlFor="confirm-password-input"
          className={classes.inputLabel}
        >
          Confirm Password
        </InputLabel>
        <BootstrapInput
          placeholder="Confirm Password *"
          id="confirm-password-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        className={matches ? classes.buttonUpdate : classes.buttonUpdateMedia}
        onClick={(e) => {
          e.preventDefault();
          setNewPassword("");
          setConfirmPassword("");
          try {
            const valid = schema.validateSync({
              newPassword,
              confirmPassword,
            });
            console.log("VALID", valid);

            resetEmailMutation({
              variables: {
                newPassword: newPassword,
                confirmPassword: confirmPassword,
                resetToken: resetToken,
              },
            })
              .then((res) => {
                localStorage.removeItem("resetToken");
                localStorage.setItem("token", res.data.resetPassword.token);
                localStorage.setItem("userId", res.data.resetPassword.userId);
                setAlertMessage("Success - Your password has been changed.");
                setSuccess(true);
                store.setState({
                  authorized: true,
                  token: res.data.resetPassword.token,
                  userId: res.data.resetPassword.userId,
                  tokenExpiration: res.data.resetPassword.tokenExpiration,
                });

                const loggedUser = {
                  userId: res.data.resetPassword.userId,
                  token: res.data.resetPassword.token,
                  first_name: firstName,
                  last_name: lastName,
                  authorized: store.state.authorized,
                };

                setAuthorized(loggedUser);

                setTimeout(() => {
                  history.push("/authorize");
                }, 3000);
              })
              .catch((error) => {
                alert(error);
                history.push("/signup");
              });
          } catch (error) {
            alert(error);
          }
        }}
      >
        Update Password
      </Button>
    </div>
  );
};
