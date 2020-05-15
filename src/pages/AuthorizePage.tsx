import React from "react";
import { useStore } from "react-stores";
import { store } from "../components/store";
import { LoginPage } from "./LoginPage";
import { SnackbarComponent } from "../components/SnackbarComponent";
import { GreetingUserComponent } from "../components/GreetingUserComponent";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    snackbar: {
      display: "flex",
      marginTop: "2vh",
      justifyContent: "center",
      alignItems: "center",
    },
    login: { display: "flex", justifyContent: "center", alignItems: "center" },
    divRoot: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

export const AuthorizePage: React.FC = () => {
  const classes = useStyles();
  const authStoreState = useStore(store);

  return authStoreState.authorized ? (
    <div>
      <div className={classes.divRoot}>
        <div className={classes.snackbar}>
          <SnackbarComponent message="Authorized" />
        </div>
      </div>

      <GreetingUserComponent />
    </div>
  ) : (
    <div>
      <div className={classes.snackbar}>
        <SnackbarComponent message="Unauthorized! - Please Sign In" />
      </div>
      <div className={classes.login}>
        <LoginPage />
      </div>
    </div>
  );
};
