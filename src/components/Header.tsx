import React, { useContext } from "react";
import logo from "../images/blog.jpg";
import LinkMaterialUI from "@material-ui/core/Link";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Divider, Button, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, grey } from "@material-ui/core/colors";
import { CURRENT_USER_QUERY } from "../graphql-queries-mutations/queries";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { useHistory, Link } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import PinterestIcon from "@material-ui/icons/Pinterest";
import InstagramIcon from "@material-ui/icons/Instagram";
import { store } from "./store";
import { ApolloClient } from "apollo-boost";
import { TabContext, CurrentUserContext } from "../App";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    padding: theme.spacing(3, 0),
    position: "relative",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[400],
    height: 40,
    width: 40,
    fontSize: "1.3rem",
    marginRight: "3%",
  },
  typography: {
    color: "#212121",
    fontSize: "1.4rem",
    height: 50,
    marginTop: 15,
  },
  button: {
    height: 35,
    width: 100,
    marginLeft: "1%",
  },
  buttonMedia: {
    height: 35,
    width: 160,
    marginLeft: "1%",
  },

  login: {
    marginRight: "1%",
  },
  mediaIcon: {
    width: 35,
    height: 35,
    marginLeft: "2%",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: grey[300],
    },
    borderRadius: 35,
  },
  margin: {
    width: 120,
    height: 35,
    alignSelf: "center",
  },
}));

function logout(apolloclient: ApolloClient<any>, history: any) {
  store.setState({
    authorized: false,
  });
  localStorage.clear();
  apolloclient.clearStore();
  history.push("/");
  window.location.reload();
}

export const Header: React.FC = () => {
  const { setTabIndex } = useContext(TabContext);
  const { setAuthorized } = useContext(CurrentUserContext);
  const history = useHistory();
  const classes = useStyles();
  const apolloclient = useApolloClient();

  function handleClick() {
    history.push("/authorize");
  }
  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading || !data) {
    return (
      <div style={{ overflowX: "hidden" }}>
        <header className={classes.header}>
          <div className={classes.buttonMedia}>
            <LinkMaterialUI href="https://www.facebook.com/" color="inherit">
              <FacebookIcon className={classes.mediaIcon} />
            </LinkMaterialUI>

            <LinkMaterialUI href="https://twitter.com/" color="inherit">
              <TwitterIcon className={classes.mediaIcon} />
            </LinkMaterialUI>

            <LinkMaterialUI href="https://www.pinterest.com/" color="inherit">
              <PinterestIcon className={classes.mediaIcon} />
            </LinkMaterialUI>

            <LinkMaterialUI href="https://www.instagram.com/" color="inherit">
              <InstagramIcon className={classes.mediaIcon} />
            </LinkMaterialUI>
          </div>
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
        <div className={classes.buttonMedia}>
          <LinkMaterialUI href="https://www.facebook.com/" color="inherit">
            <FacebookIcon className={classes.mediaIcon} />
          </LinkMaterialUI>

          <LinkMaterialUI href="https://twitter.com/" color="inherit">
            <TwitterIcon className={classes.mediaIcon} />
          </LinkMaterialUI>

          <LinkMaterialUI href="https://www.pinterest.com/" color="inherit">
            <PinterestIcon className={classes.mediaIcon} />
          </LinkMaterialUI>

          <LinkMaterialUI href="https://www.instagram.com/" color="inherit">
            <InstagramIcon className={classes.mediaIcon} />
          </LinkMaterialUI>
        </div>

        <Link to="/">
          <img src={logo} alt="Blog Logo" className="logo" />
        </Link>
        <div
          style={{
            marginRight: 20,
            width: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar className={classes.avatar}>
              {letterFN}
              {letterLN}
            </Avatar>
            <Typography className={classes.typography}>
              {firstName} {lastName}
            </Typography>
          </div>

          <Button
            variant="outlined"
            color="default"
            className={classes.margin}
            onClick={() => {
              setTabIndex(0);
              setAuthorized(false);
              logout(apolloclient, history);
            }}
          >
            Logout
          </Button>
        </div>
      </header>
      <Divider variant="fullWidth" />
    </div>
  );
};
