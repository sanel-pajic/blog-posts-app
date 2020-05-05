import React, { memo, useContext } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { NavLink } from "react-router-dom";
import { store } from "./store";
import { useStore } from "react-stores";
import { useQuery } from "@apollo/react-hooks";
import { USERS_QUERY } from "../graphql-queries-mutations/queries";
import { CircularLoading } from "./CircularLoading";
import { TabContext } from "../App";
import { useTabEffectNoAdmin } from "../hooks/useTabEffectNoAdmin";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#282c34",
    minWidth: 1240,
  },
  tabs: {
    color: theme.palette.background.paper,
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
    width: 200,
  },
}));

const Navbar: React.FC = () => {
  const authStoreState = useStore(store);
  const classes = useStyles();
  const tabEffectNoAdmin = useTabEffectNoAdmin();
  // const tabEffect = useTabEffectAllRoutes();
  const currentUser: string | null = localStorage.getItem("userId");

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "network-only",
  });

  const { tabIndex, setTabIndex } = useContext(TabContext);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
    // console.log("NEW VALUE", newValue);
  };

  function a11yProps(index: any) {
    // console.log("INDEX", index);
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  // console.log("CURRENT USER NAVBAR", currentUser);
  // console.log("TAB EFFECT", tabEffect);
  // console.log("TAB EFFECT NO ADMIN", tabEffectNoAdmin);

  if (currentUser === null) {
    setTabIndex(tabEffectNoAdmin);
  }

  if (loading || !data) {
    return <CircularLoading />;
  }

  // console.log("DATA USERS", data);

  //console.log("CURRENT USER NAVBAR", currentUser);

  const isAdminData = data.users.find(
    (user: { _id: string; isAdmin: boolean }) =>
      user._id === currentUser && user.isAdmin === true
  );

  //console.log("IS ADMIN", isAdminData);

  // console.log("STORE", authStoreState.authorized);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        position: "relative",
        bottom: "1vh",
      }}
    >
      {authStoreState.authorized ? (
        <div className={classes.root}>
          {isAdminData ? (
            <Tabs
              className={classes.tabs}
              value={tabIndex}
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
          ) : (
            <Tabs
              className={classes.tabs}
              value={tabIndex}
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
            </Tabs>
          )}
        </div>
      ) : (
        <div className={classes.root}>
          <Tabs
            className={classes.tabs}
            value={tabIndex}
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
            <Tab
              style={{ fontSize: 20 }}
              label="Blog List"
              component={React.memo(NavLink)}
              to={"/bloglist"}
              {...a11yProps(2)}
            />
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default memo(Navbar);
