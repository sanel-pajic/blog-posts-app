import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { Divider } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
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
    backgroundColor: "#fafafa",
    padding: theme.spacing(6, 0),
    position: "relative",
    bottom: 0,
    width: "100%",
    marginTop: "5%"
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
      <Divider
        style={{ position: "relative", bottom: "6.1vh", width: "100%" }}
      />
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        {description}
      </Typography>
      <Copyright />
    </footer>
  );
};
