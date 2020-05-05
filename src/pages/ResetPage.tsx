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
    margin: {
      width: "100%",
      marginTop: "1%",
    },
    buttonUpdate: {
      width: 160,
      textTransform: "none",
      marginTop: "1.5%",
    },
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

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [resetEmailMutation, { error }] = useMutation(RESET_EMAIL_MUTATION, {
    errorPolicy: "all",
  });

  if (loading || !data) {
    return <CircularLoading />;
  }

  // console.log("DATA USERS", data);

  return (
    <div className={classes.rootDiv}>
      {!success ? (
        error &&
        error.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <Alert color="error" variant="filled">
              {message}
            </Alert>
          </div>
        ))
      ) : (
        <Alert color="success" variant="filled">
          {alertMessage}
        </Alert>
      )}

      <Typography variant="h5" style={{ marginTop: "1 %" }}>
        Reset Password
      </Typography>
      <Divider className={classes.divider} />

      <FormControl className={classes.margin}>
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
      <FormControl className={classes.margin}>
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
        className={classes.buttonUpdate}
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
                console.log("DATA", res);
                localStorage.removeItem("resetToken");
                localStorage.setItem("token", res.data.resetPassword.token);
                localStorage.setItem("userId", res.data.resetPassword.userId);
                setAlertMessage("Success - Your password has been changed.");
                setSuccess(true);
                store.setState({
                  authorized: true,
                });
                console.log("STORE DATA", store);
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
