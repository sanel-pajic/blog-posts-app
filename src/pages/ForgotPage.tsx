import React, { useState } from "react";
import {
  Typography,
  Divider,
  InputBase,
  fade,
  Theme,
  withStyles,
  createStyles,
  makeStyles,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { FORGOT_EMAIL_MUTATION } from "../graphql-queries-mutations/mutations";
import * as yup from "yup";
import Alert from "@material-ui/lab/Alert";

let schema = yup.object().shape({
  forgotEmail: yup.string().required().min(5).email(),
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
    formControlMedia: {
      width: "100%",
      marginTop: "5%",
      marginBottom: "5%",
    },
    buttonReset: {
      width: 140,
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
      marginTop: "10%",
    },
    inputEmailLabel: { fontSize: 22, fontWeight: "bold", marginLeft: 5 },
    inputEmailMedia: {
      fontSize: 22,
      fontWeight: "bold",
      marginLeft: 5,
      marginTop: 15,
    },
    typographyForgot: { marginTop: "1%" },
    typographyForgotMedia: { marginTop: "3%" },
    alert: { display: "flex", justifyContent: "center", alignItems: "center" },
  })
);

export const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.common.white,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  })
)(InputBase);

export const ForgotPage: React.FC = () => {
  const classes = useStyles();
  const [forgotEmail, setForgotEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [forgotEmailMutation, { error }] = useMutation(FORGOT_EMAIL_MUTATION, {
    errorPolicy: "all",
  });

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

      <Typography
        variant="h5"
        className={
          matches ? classes.typographyForgot : classes.typographyForgotMedia
        }
      >
        Forgot Password
      </Typography>
      <Divider style={{ width: "100%", marginTop: "1%" }} />

      <FormControl
        className={matches ? classes.formControl : classes.formControlMedia}
      >
        <InputLabel
          shrink
          htmlFor="forgot-input"
          className={classes.inputEmailLabel}
        >
          Email
        </InputLabel>
        <BootstrapInput
          placeholder="Email Address *"
          id="forgot-input"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={classes.buttonReset}
        onClick={(e) => {
          e.preventDefault();
          setForgotEmail("");
          try {
            const valid = schema.validateSync({
              forgotEmail,
            });
            console.log("VALID", valid);

            forgotEmailMutation({
              variables: {
                email: forgotEmail,
              },
            })
              .then((res) => {
                console.log("DATA", res);
                setAlertMessage(res.data.forgot.message);
                console.log(res.data.forgot.message);
                setSuccess(true);
              })
              .catch((error) => {
                console.log("ERROR SEND EMAIL", error);
              });
          } catch (error) {
            alert(error);
          }
        }}
      >
        Reset Password
      </Button>
    </div>
  );
};
