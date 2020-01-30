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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

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
          <Tab
            style={{ fontSize: 20 }}
            label="AUTHORIZE PAGE"
            {...authStoreState.authorized}
            component={NavLink}
            to={"/authorize"}
            {...a11yProps(5)}
          />
        </Tabs>
      </div>
    </div>
  );
};
