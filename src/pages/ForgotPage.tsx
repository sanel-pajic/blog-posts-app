import React from "react";
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
} from "@material-ui/core";

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
    buttonReset: {
      width: 140,
      textTransform: "none",
      marginTop: "1.5%",
    },
  })
);

const BootstrapInput = withStyles((theme: Theme) =>
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
      // Use the system font instead of the default Roboto font.
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

  return (
    <div
      style={{
        width: "80%",
        paddingLeft: "10%",
        paddingRight: "5%",
        paddingTop: "2%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100%",
        marginBottom: "12.7%",
      }}
    >
      <Typography variant="h5">Forgot Password</Typography>
      <Divider style={{ width: "100%", marginTop: "1%" }} />

      <FormControl className={classes.margin}>
        <InputLabel
          shrink
          htmlFor="forgot-input"
          style={{ fontSize: 22, fontWeight: "bold", marginLeft: 5 }}
        >
          Email
        </InputLabel>
        <BootstrapInput placeholder="Email Address *" id="forgot-input" />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        className={classes.buttonReset}
      >
        Reset Password
      </Button>
    </div>
  );
};
