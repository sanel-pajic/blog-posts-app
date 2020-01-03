import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import image from "../images/dog.jpg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1)
      }
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      marginTop: "5%",
      marginBottom: "15%"
    }
  })
);

export const GreetingUserComponent: React.FC = () => {
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <Paper
        style={{
          width: "30%",
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <Typography variant="h3">Hello User</Typography>
        <Avatar alt="User Image" src={image} className={classes.large} />
        <Typography variant="h5" color="textSecondary">
          Enjoy adding your new blogs!
        </Typography>
      </Paper>
    </div>
  );
};
