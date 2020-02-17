import React from "react";
import logo from "../images/blog.jpg";
import { Link } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Divider, Button, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import { CURRENT_USER_QUERY } from "../queries/queries";
import { useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

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
    height: 50,
    width: 50,
    fontSize: "1.7rem",
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
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  login: {
    marginRight: "1%"
  }
}));

export const Header: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();

  function handleClick() {
    history.push("/authorize");
  }
  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (loading || !data) {
    return (
      <div style={{ overflowX: "hidden" }}>
        <header className={classes.header}>
          <Button variant="outlined" className={classes.button}>
            SUBSCRIBE
          </Button>
          <Link to="/">
            <img src={logo} alt="Blog Logo" className="logo" />
          </Link>
          <div className={classes.login}>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={handleClick}
            >
              LOGIN
            </Button>
          </div>
        </header>
      </div>
    );
  }
  //console.log("DATA CURRENT USER QUERY", data);
  const firstName: string = data.currentUser.first_name;
  const lastName: string = data.currentUser.last_name;
  const letterFN = firstName.charAt(0);
  const letterLN = lastName.charAt(0);

  return (
    <div style={{ overflow: "auto" }}>
      <header className={classes.header}>
        <Button variant="outlined" className={classes.button}>
          SUBSCRIBE
        </Button>
        <Link to="/">
          <img src={logo} alt="Blog Logo" className="logo" />
        </Link>
        <div className={classes.divAvatarUser}>
          <Avatar className={classes.avatar}>
            {letterFN}
            {letterLN}
          </Avatar>
          <div style={{ marginTop: "5%" }}>
            <Typography className={classes.typography}>
              {firstName} {lastName}
            </Typography>
          </div>
        </div>
      </header>
      <Divider variant="fullWidth" />
    </div>
  );
};
