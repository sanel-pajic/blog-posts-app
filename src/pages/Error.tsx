import React from "react";
import { Link } from "react-router-dom";
import logoError from "../images/error.png";
import Button from "@material-ui/core/Button";
import { Paper, makeStyles, useTheme, useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  divRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: "40%",
    height: "50vh",
    padding: "5%",
    marginTop: "1%",
  },
  paperMedia: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: 330,
    height: "70vh",
    padding: "5%",
    marginTop: "10%",
  },
  button: { position: "relative", bottom: "5vh" },
  buttonMedia: { position: "relative", bottom: "9vh" },
  logo: { marginTop: "3vh" },
  logoMedia: { marginTop: "20%" },
}));

export const Error: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div className={classes.divRoot}>
      <Paper className={matches ? classes.paper : classes.paperMedia}>
        <img
          src={logoError}
          alt="Error Logo"
          className={matches ? classes.logo : classes.logoMedia}
        />

        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            color="default"
            className={matches ? classes.button : classes.buttonMedia}
          >
            Back to home
          </Button>
        </Link>
      </Paper>
    </div>
  );
};
