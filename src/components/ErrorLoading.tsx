import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  divRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 150,
  },
  errorIcon: { width: 100, height: 100 },
}));

export const ErrorLoading: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.divRoot}>
      <ErrorIcon className={classes.errorIcon} color="error" fontSize="large" />

      <Typography color="textSecondary" variant="h3" style={{ marginTop: 20 }}>
        Error Loading !!!
      </Typography>
      <Typography color="textSecondary" variant="h3" style={{ marginTop: 20 }}>
        To continue, try to reload.
      </Typography>
    </div>
  );
};
