import React from "react";
import logo from "../images/blog.jpg";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Paper as div, Divider, Button, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(1, 0),
    position: "relative",
    top: 0,
    width: "100%",
    display: "flex"
  }
}));

export const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <div>
      <header className={classes.header}>
        <Button
          variant="outlined"
          style={{ height: 35, position: "relative", left: "150px", top: 10 }}
        >
          {" "}
          SUBSCRIBE
        </Button>
        <Container maxWidth="lg">
          <Link to="/">
            <div
              style={{
                height: 55,
                width: 180,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                left: "40%"
              }}
            >
              <img
                src={logo}
                alt="Blog Logo"
                className="logo"
                style={{
                  padding: 2,
                  width: 130
                }}
              />
            </div>
          </Link>
        </Container>
        <IconButton
          style={{ position: "relative", right: 110, height: 55, width: 55 }}
        >
          <SearchIcon />
        </IconButton>
        <Button
          variant="outlined"
          style={{ height: 35, position: "relative", right: 100, top: 10 }}
        >
          {" "}
          SIGN UP
        </Button>
      </header>
      <Divider variant="middle" />
    </div>
  );
};
