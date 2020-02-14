import React from "react";
import { ImageCarousel } from "../components/ImageCarousel";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    height: "45vh",
    width: "28vw",
    margin: theme.spacing(1)
  }
}));

export const Home: React.FC = () => {
  const classes = useStyles();
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: "2vh",
          marginBottom: "10vh"
        }}
      >
        <div
          style={{
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ImageCarousel />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <Paper className={classes.paper}>FEATURED BLOG 1</Paper>
        <Paper className={classes.paper}>FEATURED BLOG 2</Paper>
        <Paper className={classes.paper}>FEATURED BLOG 2</Paper>
      </div>
    </div>
  );
};
