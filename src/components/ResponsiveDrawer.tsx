import React, { useState } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
  })
);

const ResponsiveDrawer: React.FC = (props: any) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Home");

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
