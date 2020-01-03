import React from "react";
import { useStore } from "react-stores";
import { store } from "../components/store";
import { logout } from "../components/authActions";
import { LoginPage } from "./LoginPage";
import { makeStyles, createStyles, Theme, withStyles } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { SnackbarComponent } from "../components/SnackbarComponent";
import { GreetingUserComponent } from "../components/GreetingUserComponent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1)
    }
  })
);

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[800]),
    backgroundColor: red[400],
    "&:hover": {
      backgroundColor: red[600]
    }
  }
}))(Button);

export const AuthorizePage: React.FC = () => {
  const classes = useStyles();
  const authStoreState = useStore(store);

  console.log("AUTH STATE STORE", authStoreState);

  return authStoreState.authorized ? (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "1%"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "2%",
              marginTop: "1%"
            }}
          >
            <SnackbarComponent message="Authorized" />
          </div>
          <ColorButton
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={logout}
          >
            Press to logout
          </ColorButton>
        </div>
      </div>
      <GreetingUserComponent />
    </div>
  ) : (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "2%",
          marginTop: "1%"
        }}
      >
        <SnackbarComponent message="Unauthorized! - Please Sign In" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <LoginPage />
      </div>
    </div>
  );
};
