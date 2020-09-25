import React, { memo, useContext, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
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
  divRoot: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
    bottom: "1vh",
  },
  tabHome: { fontSize: 20, marginLeft: "10vw" },
  tabGeneral: { fontSize: 20 },
}));

const Navbar: React.FC = () => {
  const authStoreState = useStore(store);
  const classes = useStyles();
  const tabEffectNoAdmin = useTabEffectNoAdmin();
  const currentUser: string | null = localStorage.getItem("userId");

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "network-only",
  });

  const { tabIndex, setTabIndex } = useContext(TabContext);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    if (currentUser === null) {
      setTabIndex(tabEffectNoAdmin);
    }
  }, [currentUser, tabEffectNoAdmin, setTabIndex]);

  if (loading || !data) {
    return <CircularLoading />;
  }

  const isAdminData = data.users.find(
    (user: { _id: string; isAdmin: boolean }) =>
      user._id === currentUser && user.isAdmin === true
  );

  return (
    <div className={classes.divRoot}>
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
                className={classes.tabHome}
                label="Home"
                component={React.memo(NavLink)}
                to={"/"}
                {...a11yProps(0)}
              />
              <Tab
                className={classes.tabGeneral}
                label="Add Blog Post"
                component={React.memo(NavLink)}
                to={"/addblogpost"}
                {...a11yProps(1)}
              />
              <Tab
                className={classes.tabGeneral}
                label="Blog List"
                component={React.memo(NavLink)}
                to={"/bloglist"}
                {...a11yProps(3)}
              />
              <Tab
                className={classes.tabGeneral}
                label="User List"
                component={React.memo(NavLink)}
                to={"/userlist"}
                {...a11yProps(4)}
              />
              <Tab
                className={classes.tabGeneral}
                label="User List MUI DT"
                component={React.memo(NavLink)}
                to={"/muiusers"}
                {...a11yProps(5)}
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
                className={classes.tabHome}
                label="Home"
                component={React.memo(NavLink)}
                to={"/"}
                {...a11yProps(0)}
              />
              <Tab
                className={classes.tabGeneral}
                label="Add Blog Post"
                component={React.memo(NavLink)}
                to={"/addblogpost"}
                {...a11yProps(1)}
              />
              <Tab
                className={classes.tabGeneral}
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
              className={classes.tabHome}
              label="Home"
              component={React.memo(NavLink)}
              to={"/"}
              {...a11yProps(0)}
            />
            <Tab
              className={classes.tabGeneral}
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
