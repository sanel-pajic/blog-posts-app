import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { Divider } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" align="center" style={{ color: "#afafaf" }}>
      {"Copyright © "}
      <Link
        color="primary"
        href="https://react-beach-resort-sanel-recording.netlify.com/"
      >
        Sanel Pajic
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: "#282c34",
    position: "relative",
    bottom: 0,
    width: "100%",
    height: 170,
    marginTop: "20vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", 
    padding:"2%"
  }
}));

export const Footer: React.FC<{
  description: string;
  title: string;
}> = props => {
  const classes = useStyles();
  const { description, title } = props;

  return (
    <footer className={classes.footer}>
      <Divider />
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        style={{ color: "#afafaf" }}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        style={{ color: "#afafaf" }}
        component="p"
      >
        {description}
      </Typography>
      <Copyright />
    </footer>
  );
};
