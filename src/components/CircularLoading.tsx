import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import CircularProgress, {
  CircularProgressProps
} from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";

const useStylesFacebook = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100
  },
  top: {
    color: "#eef3fd"
  },
  bottom: {
    color: "#6798e5",
    animationDuration: "550ms"
  }
});

function FacebookProgress(props: CircularProgressProps) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.bottom}
        size={170}
        thickness={2}
        {...props}
      />
      <Typography variant="h4" style={{ marginTop: 30 }}>
        Loading ...
      </Typography>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    margin: {
      margin: theme.spacing(1)
    }
  })
);

export const CircularLoading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FacebookProgress />
    </div>
  );
};
