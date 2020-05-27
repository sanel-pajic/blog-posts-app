import React, { useState, useContext } from "react";
import { NavLink, Link, withRouter, useHistory } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  ListItemText,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Avatar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Home } from "../pages/Home";
import { BlogList } from "./BlogList";
import { ComponentArticle } from "../pages/ComponentArticle";
import { AddBlogPost } from "../pages/AddBlogPost";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import logo from "../images/blog.jpg";
import { useStore } from "react-stores";
import { store } from "./store";
import { red, deepOrange } from "@material-ui/core/colors";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../graphql-queries-mutations/queries";
import { CurrentUserContext, TabContext } from "../App";
import { logout } from "./Header";

const Routes = [
  {
    path: "/",
    sidebarName: "Home",
    component: Home,
  },
  {
    path: "/article",
    sidebarName: "Component Article",
    component: ComponentArticle,
  },
  {
    path: "/addblogpost",
    sidebarName: "Add Blog Post",
    component: AddBlogPost,
  },
  {
    path: "/bloglist",
    sidebarName: "Blog List",
    component: BlogList,
  },
];

const NoUserRoutes = [
  {
    path: "/",
    sidebarName: "Home",
    component: Home,
  },

  {
    path: "/addblogpost",
    sidebarName: "Add Blog Post",
    component: AddBlogPost,
  },
  {
    path: "/bloglist",
    sidebarName: "Blog List",
    component: BlogList,
  },
];

export const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[400]),
    backgroundColor: red[400],
    "&:hover": {
      backgroundColor: red[500],
    },
  },
}))(Button);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      width: 300,
    },
    fullList: {
      width: "auto",
    },
    listItemText: {
      textTransform: "uppercase",
    },
    button: {
      width: 100,
      marginRight: 5,
    },
    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[400],
      height: 40,
      width: 40,
      fontSize: "1.3rem",
      marginRight: "5%",
    },
  })
);

const ResponsiveDrawer: React.FC = (props: any) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Home");
  const history = useHistory();
  const apolloclient = useApolloClient();
  const { setTabIndex } = useContext(TabContext);

  const { first_name, last_name, setAuthorized } = useContext(
    CurrentUserContext
  );

  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  // const token = localStorage.getItem("token");

  const authStoreState = useStore(store);

  // if (!token) {
  //   return <Redirect to="/authorize" />;
  // }

  const activeRoute = (routeName: any) => {
    return props.location.pathname === routeName ? true : false;
  };

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsOpen(open);
  };

  function handleClick() {
    history.push("/authorize");
  }

  if (loading || !data) {
    return (
      <div>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar style={{ backgroundColor: "#282c34" }}>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" className={classes.title}>
                {title}
              </Typography>
              <ColorButton
                className={classes.button}
                onClick={handleClick}
                size="small"
              >
                LOGIN
              </ColorButton>
            </Toolbar>
          </AppBar>
        </div>
        <Drawer
          classes={{ paper: classes.drawer }}
          open={isOpen}
          onClose={toggleDrawer(false)}
        >
          <div
            className={classes.fullList}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Divider style={{ marginTop: 50 }} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Link to="/">
                <img src={logo} alt="Blog Logo" />
              </Link>
            </div>
            <Divider style={{ marginTop: 20 }} />
            {authStoreState.authorized ? (
              <List>
                {Routes.map((prop, key) => (
                  <ListItem
                    button
                    key={key}
                    component={NavLink}
                    to={prop.path}
                    onClick={() => setTitle(prop.sidebarName)}
                  >
                    <ListItemIcon>
                      <PlayArrowIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={prop.sidebarName}
                      className={classes.listItemText}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <List>
                {NoUserRoutes.map((prop, key) => (
                  <ListItem
                    button
                    key={key}
                    component={NavLink}
                    to={prop.path}
                    onClick={() => setTitle(prop.sidebarName)}
                    selected={activeRoute(prop.path)}
                  >
                    <ListItemIcon>
                      <PlayArrowIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={prop.sidebarName}
                      className={classes.listItemText}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Divider />
          </div>
        </Drawer>
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
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar style={{ backgroundColor: "#282c34" }}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" className={classes.title}>
              {title}
            </Typography>
            <Avatar className={classes.avatar}>
              {letterFN || letterFNContext}
              {letterLN || letterLNContext}
            </Avatar>
            <ColorButton
              className={classes.button}
              size="small"
              onClick={() => {
                setTabIndex(0);
                setAuthorized(false);
                logout(apolloclient, history);
              }}
            >
              Logout
            </ColorButton>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer
        classes={{ paper: classes.drawer }}
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <div
          className={classes.fullList}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Divider style={{ marginTop: 50 }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Link to="/">
              <img src={logo} alt="Blog Logo" />
            </Link>
          </div>
          <Divider style={{ marginTop: 20 }} />
          {authStoreState.authorized ? (
            <List>
              {Routes.map((prop, key) => (
                <ListItem
                  button
                  key={key}
                  component={NavLink}
                  to={prop.path}
                  onClick={() => setTitle(prop.sidebarName)}
                >
                  <ListItemIcon>
                    <PlayArrowIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.sidebarName}
                    className={classes.listItemText}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <List>
              {NoUserRoutes.map((prop, key) => (
                <ListItem
                  button
                  key={key}
                  component={NavLink}
                  to={prop.path}
                  onClick={() => setTitle(prop.sidebarName)}
                  selected={activeRoute(prop.path)}
                >
                  <ListItemIcon>
                    <PlayArrowIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.sidebarName}
                    className={classes.listItemText}
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Divider />
        </div>
      </Drawer>
    </div>
  );
};

export default withRouter(ResponsiveDrawer);
