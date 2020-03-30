import React, { useEffect, memo } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { NavLink, useLocation } from "react-router-dom";
import { store } from "./store";
import { useStore } from "react-stores";
import { useQuery } from "@apollo/react-hooks";
import { USERS_QUERY } from "../queries/queries";
import { CircularLoading } from "./CircularLoading";
import { useFetchQueryCurrentUser } from "./useFetchQueryCurrentUser";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#282c34",
    minWidth: 1240
  },
  tabs: {
    color: theme.palette.background.paper,
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1),
    width: 200
  }
}));

const Navbar: React.FC = () => {
  const authStoreState = useStore(store);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const currentUserData = useFetchQueryCurrentUser();

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "network-only"
  });

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
    }
  }, [location, ROUTES]);

  if (loading || !data) {
    return <CircularLoading />;
  }

  // console.log("DATA USERS", data);

  const currentUser = currentUserData.toLocaleString();

  //console.log("CURRENT USER NAVBAR", currentUser);

  const isAdminData = data.users.find(
    (user: { _id: string; isAdmin: boolean }) =>
      user._id === currentUser && user.isAdmin === true
  );

  //console.log("IS ADMIN", isAdminData);

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
      {isAdminData ? (
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
      ) : (
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
          </Tabs>
        </div>
      )}
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
        </Tabs>
      </div>
    </div>
  );
};

export default memo(Navbar);
