import React, { useState } from "react";
import { Tab, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  AppTest: {
    fontFamily: "sans-serif",
    textAlign: "center",
    width: 500,
    margin: "0 auto",
  },
  tabs: {
    display: "flex",
    listStyleType: "none",
    background: " #eee",
    padding: "3px 0",
  },
}));

const TabContext = React.createContext({ value: 0 });

const TabsComponent = (props: {
  children: React.ReactNode;
  defaultTab: any;
}) => {
  const { children, defaultTab } = props;
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    //@ts-ignore
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

const TabComponent = (props: { label: any; tabIndex: any }) => {
  //@ts-ignore
  const { activeTab, setActiveTab } = React.useContext(TabContext);
  const { label, tabIndex } = props;
  const active = activeTab === tabIndex;

  return (
    <Tab
      className={`tabs-tab ${active ? "active" : ""}`}
      style={{ fontSize: 20, marginLeft: "10vw" }}
      label={label}
      onClick={() => setActiveTab(tabIndex)}
    >
      {" "}
      {label}{" "}
    </Tab>
  );
};

const TabPane = (props: { children: any; tabIndex: any }) => {
  //@ts-ignore
  const { activeTab } = React.useContext(TabContext);
  const { children, tabIndex } = props;
  console.log("ACTIVE TAB", activeTab);
  if (activeTab === tabIndex) {
    return <div className="tabs-tab-pane">{children}</div>;
  } else {
    return null;
  }
};

export const TestTabComponent = () => {
  const classes = useStyles();
  return (
    <div className={classes.AppTest}>
      <TabsComponent defaultTab={0}>
        <div className="tabs">
          <TabComponent label="Home" tabIndex={0} />
          <TabComponent label="Contact" tabIndex={1} />
        </div>

        <TabPane tabIndex={0}>Tab Content for Home</TabPane>
        <TabPane tabIndex={1}>Tab Content for Contact</TabPane>
      </TabsComponent>
    </div>
  );
};
