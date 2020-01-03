import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { NavLink } from "react-router-dom";
import { store } from "./store";
import { useStore } from "react-stores";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#282c34"
  },
  tabs: {
    color: theme.palette.background.paper
  }
}));

export const Navbar: React.FC = () => {
  const authStoreState = useStore(store);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  console.log(authStoreState);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
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
            style={{ fontSize: 20 }}
            label="Home"
            component={NavLink}
            to={"/"}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="Add Blog Post"
            component={NavLink}
            to={"/addblogpost"}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="About"
            component={NavLink}
            to={"/about"}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="Blog List"
            component={NavLink}
            to={"/bloglist"}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="User List"
            component={NavLink}
            to={"/userlist"}
          />
          <Tab
            style={{ fontSize: 20 }}
            label="AUTHORIZE PAGE"
            {...authStoreState.authorized}
            component={NavLink}
            to={"/authorize"}
          />
        </Tabs>
      </div>
    </div>
  );
};
