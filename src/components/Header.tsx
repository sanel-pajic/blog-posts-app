import React, { useContext } from "react";
import logo from "../images/blog.jpg";
import LinkMaterialUI from "@material-ui/core/Link";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import {
  Divider,
  Button,
  Typography,
  useMediaQuery,
  Avatar,
  Box,
} from "@material-ui/core";

import { deepOrange, grey } from "@material-ui/core/colors";
import { CURRENT_USER_QUERY } from "../graphql-queries-mutations/queries";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { useHistory, Link } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import PinterestIcon from "@material-ui/icons/Pinterest";
import InstagramIcon from "@material-ui/icons/Instagram";
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
  headerMedia: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    marginRight: 5,
  },
  buttonSocialIcons: {
    height: 35,
    width: 160,
    marginLeft: "1%",
  },
  buttonSocialIconsMedia: {
    height: 35,
    width: 160,
    marginBottom: 15,
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
  imageLogo: {
    margin: 0,
    padding: 0,
    position: "relative",
  },
  imageLogoMedia: {
    marginTop: 15,
    marginBottom: 5,
  },
  userDataButtonLogout: {
    marginRight: 20,
    width: 200,
    display: "flex",
    flexDirection: "column",
  },
  avatarTypographyTogether: {
    display: "flex",
    alignItems: "center",
  },
}));

export function logout(
  apolloclient: ApolloClient<any>,
  history: any,
  setAuthorized: Function
) {
  setAuthorized(false);
  localStorage.clear();
  apolloclient.clearStore();
  history.push("/");
  window.location.reload();
}

export const Header: React.FC = () => {
  const { setTabIndex } = useContext(TabContext);
  const history = useHistory();
  const classes = useStyles();
  const apolloclient = useApolloClient();

  const { first_name, last_name, setAuthorized } = useContext(
    CurrentUserContext
  );

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  function handleClick() {
    history.push("/authorize");
  }
  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading || !data) {
    return (
      <div style={{ overflowX: "hidden" }}>
        <header className={matches ? classes.header : classes.headerMedia}>
          <Box {...(matches ? { order: "1" } : { order: "2" })}>
            <div
              className={
                matches
                  ? classes.buttonSocialIcons
                  : classes.buttonSocialIconsMedia
              }
            >
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
          </Box>
          <Box order={1}>
            <Link to="/">
              <img
                src={logo}
                alt="Blog Logo"
                className={matches ? classes.imageLogo : classes.imageLogoMedia}
              />
            </Link>
          </Box>
          <Box order={3}>
            <div className={classes.login}>
              {matches ? (
                <Button
                  variant="outlined"
                  className={classes.button}
                  onClick={handleClick}
                >
                  LOGIN
                </Button>
              ) : null}
            </div>
          </Box>
        </header>
      </div>
    );
  }

  const firstName: string = data.currentUser.first_name;
  const lastName: string = data.currentUser.last_name;
  const letterFN = firstName.charAt(0);
  const letterLN = lastName.charAt(0);

  const firstNameContext: string = first_name;
  const lastNameContext: string = last_name;
  const letterFNContext = firstNameContext.charAt(0);
  const letterLNContext = lastNameContext.charAt(0);

  return (
    <div style={{ overflow: "auto" }}>
      <header className={matches ? classes.header : classes.headerMedia}>
        <Box {...(matches ? { order: "1" } : { order: "2" })}>
          <div
            className={
              matches
                ? classes.buttonSocialIcons
                : classes.buttonSocialIconsMedia
            }
          >
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
        </Box>

        <Box order={1}>
          <Link to="/">
            <img
              src={logo}
              alt="Blog Logo"
              className={matches ? classes.imageLogo : classes.imageLogoMedia}
            />
          </Link>
        </Box>
        <Box order={3}>
          <div className={classes.userDataButtonLogout}>
            <div className={classes.avatarTypographyTogether}>
              {matches ? (
                <Avatar className={classes.avatar}>
                  {letterFN || letterFNContext}
                  {letterLN || letterLNContext}
                </Avatar>
              ) : null}
              {matches ? (
                <Typography className={classes.typography}>
                  {firstName} {lastName}
                </Typography>
              ) : null}
            </div>
            {matches ? (
              <Button
                variant="outlined"
                color="default"
                className={classes.margin}
                onClick={() => {
                  setTabIndex(0);
                  setAuthorized(false);
                  logout(apolloclient, history, setAuthorized);
                }}
              >
                Logout
              </Button>
            ) : null}
          </div>
        </Box>
      </header>
      <Divider variant="fullWidth" />
    </div>
  );
};
