import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: 680,
    height: 50,
    marginTop: 20,
    marginLeft: 50
  }
});

export const Navbar: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        bottom: 0
      }}
    >
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="default"
          centered
        >
          <Tab label="Home" component={Link} to={"/"} />
          <Tab label="Add Blog Post" component={Link} to={"/addblogpost"} />
          <Tab label="About" component={Link} to={"/about"} />
          <Tab label="Blog List" component={Link} to={"/list"} />
        </Tabs>
      </Paper>
    </div>
  );
};
