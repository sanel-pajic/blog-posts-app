import React from "react";
import logo from "../images/blog.jpg";
import LinkMaterialUI from "@material-ui/core/Link";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Divider, Button, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, grey } from "@material-ui/core/colors";
import { CURRENT_USER_QUERY } from "../queries/queries";
import { useQuery } from "@apollo/react-hooks";
import { useHistory, Link } from "react-router-dom";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import PinterestIcon from "@material-ui/icons/Pinterest";
import InstagramIcon from "@material-ui/icons/Instagram";

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
  buttonMedia: {
    height: 35,
    width: 160,
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
  },
  mediaIcon: {
    width: 35,
    height: 35,
    marginLeft: "2%",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: grey[300]
    },
    borderRadius: 35
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
