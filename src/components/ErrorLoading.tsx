import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import {
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

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
  errorIconMedia: { width: 70, height: 70 },
  typography: { marginTop: 20 },
}));

export const ErrorLoading: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div className={classes.divRoot}>
      <ErrorIcon
        className={matches ? classes.errorIcon : classes.errorIconMedia}
        color="error"
        fontSize="large"
      />

      <Typography
        color="textSecondary"
        variant={matches ? "h3" : "h4"}
        className={classes.typography}
      >
        Error Loading !!!
      </Typography>
      <Typography
        color="textSecondary"
        variant={matches ? "h3" : "h4"}
        className={classes.typography}
      >
        To continue, try to reload.
      </Typography>
    </div>
  );
};
