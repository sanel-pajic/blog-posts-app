import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "41vw",
    height: "6vh",
    marginTop: "2vh"
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
        bottom: "1vh"
      }}
    >
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
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
