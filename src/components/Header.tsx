import React from "react";
import logo from "../images/blog.jpg";
import { Link } from "react-router-dom";
import { makeStyles, fade } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Divider, Button, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(2, 0),
    position: "relative",
    top: 0,
    width: "100%",
    display: "flex",
    backgroundColor: "#fafafa"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.05),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.15)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1.5, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "8vw"
    }
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[400],
    height: "6vh",
    width: "3vw",
    fontSize: "2.2rem"
  }
}));

export const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <div>
      <header className={classes.header}>
        <Button
          variant="outlined"
          style={{
            height: "10%",
            position: "relative",
            left: "5%",
            top: "1vh",
            width: "10%"
          }}
        >
          {" "}
          SUBSCRIBE
        </Button>
        <Container maxWidth="lg">
          <Link to="/">
            <div
              style={{
                height: "7vh",
                width: "12vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                left: "50%"
              }}
            >
              <img
                src={logo}
                alt="Blog Logo"
                className="logo"
                style={{
                  padding: "1%",
                  width: "90%"
                }}
              />
            </div>
          </Link>
        </Container>
        <div
          className={classes.search}
          style={{
            position: "relative",
            right: "2rem",
            height: "2.5rem",
            top: "1vh",
            width: "22vw"
          }}
        >
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        <div
          style={{
            height: "4.5vh",
            position: "relative",
            right: "1rem",
            top: "1vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Avatar className={classes.orange}>S</Avatar>
          <Typography
            variant="h5"
            style={{
              color: "#212121",
              marginLeft: "0.5rem",
              width: "8rem"
            }}
          >
            Hello User
          </Typography>
        </div>
      </header>
      <Divider variant="fullWidth" />
    </div>
  );
};
