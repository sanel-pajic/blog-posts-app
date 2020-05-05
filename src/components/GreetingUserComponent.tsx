import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import image from "../images/blog1.jpg";
import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../graphql-queries-mutations/queries";
import { CircularLoading } from "./CircularLoading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: 250,
      height: 200,
      marginTop: "4%",
      marginBottom: "4%",
    },
  })
);

export const GreetingUserComponent: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  if (loading || !data) {
    return <CircularLoading />;
  }

  console.log("GREETING COMPONENT DATA", data);

  const firstName = data.currentUser.first_name;
  const lastName = data.currentUser.last_name;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Paper
        style={{
          width: "62vw",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "1%",
        }}
      >
        <Typography variant="h5" color="textSecondary">
          Successfully Signed Up!
        </Typography>
        <Typography style={{ fontSize: 29, color: "#ff9800" }}>
          Nice to meet you {firstName} {lastName}
        </Typography>
        <Avatar alt="User Image" src={image} className={classes.large} />
        <Typography variant="h5" color="textSecondary">
          Enjoy adding your new blogs!
        </Typography>
      </Paper>
    </div>
  );
};
