import React from "react";
import logo from "../images/blog.jpg";
import { Link } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Divider, Button, Typography } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    padding: theme.spacing(3, 0),
    position: "relative",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper
  },
  avatar: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[400],
    height: 45,
    width: 45,
    fontSize: "2.2rem",
    marginRight: "3%"
  },
  typography: {
    color: "#212121",
    fontSize: "1.6rem"
  },
  button: {
    height: 35,
    width: 100,
    marginLeft: "1%"
  },
  divAvatarUser: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginRight: "1%"
  }
}));

export const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <div>
      <header className={classes.header}>
        <Button variant="outlined" className={classes.button}>
          SUBSCRIBE
        </Button>
        <Link to="/">
          <img src={logo} alt="Blog Logo" className="logo" />
        </Link>
        <div className={classes.divAvatarUser}>
          <Avatar className={classes.avatar}>S</Avatar>
          <Typography className={classes.typography}>Hello User</Typography>
        </div>
      </header>
      <Divider variant="fullWidth" />
    </div>
  );
};
