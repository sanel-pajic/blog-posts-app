import React, { useEffect, memo } from "react";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { NavLink, useLocation } from "react-router-dom";
import { store } from "./store";
import { useStore } from "react-stores";
import { Button } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#282c34"
  },
  tabs: {
    color: theme.palette.background.paper,
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[800]),
    backgroundColor: red[400],
    "&:hover": {
      backgroundColor: red[600]
    }
  }
}))(Button);

function logout() {
  store.setState({
    authorized: false,
    token: "",
    userId: "",
    tokenExpiration: 0
  });
  localStorage.clear();
  window.location.reload();
}

const Navbar: React.FC = () => {
  const authStoreState = useStore(store);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  console.log("LOCATION", location);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  const ROUTES = ["/", "/addblogpost", "/article", "/bloglist", "/userlist"];

  useEffect(() => {
    const pathIndex = ROUTES.findIndex(val => {
      return val === location.pathname;
    });
    if (pathIndex >= 0) {
      setValue(pathIndex);
      console.log("PATH INDEX", pathIndex);
    }
  }, [location, ROUTES]);

  return authStoreState.authorized ? (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        position: "relative",
        bottom: "1vh"
      }}
    >
      <div className={classes.root}>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          centered
        >
          <Tab
            style={{ fontSize: 20, marginLeft: "10vw" }}
            label="Home"
            component={NavLink}
            to={"/"}
            {...a11yProps(0)}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="Add Blog Post"
            component={NavLink}
            to={"/addblogpost"}
            {...a11yProps(1)}
          />
          )}
          <Tab
            style={{ fontSize: 20 }}
            label="Component Article"
            component={NavLink}
            to={"/article"}
            {...a11yProps(2)}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="Blog List"
            component={NavLink}
            to={"/bloglist"}
            {...a11yProps(3)}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="User List"
            component={NavLink}
            to={"/userlist"}
            {...a11yProps(4)}
          />
          <ColorButton
            variant="contained"
            color="primary"
            className={classes.margin}
            onClick={logout}
          >
            Press to logout
          </ColorButton>
        </Tabs>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        position: "relative",
        bottom: "1vh"
      }}
    >
      <div className={classes.root}>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          centered
        >
          <Tab
            style={{ fontSize: 20, marginLeft: "10vw" }}
            label="Home"
            component={React.memo(NavLink)}
            to={"/"}
            {...a11yProps(0)}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="Add Blog Post"
            component={React.memo(NavLink)}
            to={"/addblogpost"}
            {...a11yProps(1)}
          />
          )}
          <Tab
            style={{ fontSize: 20 }}
            label="Component Article"
            component={React.memo(NavLink)}
            to={"/article"}
            {...a11yProps(2)}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="Blog List"
            component={React.memo(NavLink)}
            to={"/bloglist"}
            {...a11yProps(3)}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="User List"
            component={React.memo(NavLink)}
            to={"/userlist"}
            {...a11yProps(4)}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default memo(Navbar);
