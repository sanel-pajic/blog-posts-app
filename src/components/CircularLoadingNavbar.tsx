import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import {
  CircularProgress,
  CircularProgressProps,
} from "@material-ui/core";

const useStylesFacebook = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  bottom: {
    color: "#FFFFFF",
    animationDuration: "550ms",
  },
});

function FacebookProgress(props: CircularProgressProps) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.bottom}
        size={12}
        thickness={1}
        {...props}
      />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
  })
);

export const CircularLoadingNavbar: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FacebookProgress />
    </div>
  );
};
