import React from "react";
import {
  Paper,
  Avatar,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  IconButton,
  Divider
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import Like from "@material-ui/icons/ThumbUpAltOutlined";
import { green } from "@material-ui/core/colors";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";

const data = {
  comments: [
    {
      _id: "12345",
      postId: "56789",
      text:
        "data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text dText data Text data Text data Text data Text dText data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text data Text",
      user_name: "Sanel"
    }
  ]
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root1: {
      padding: "0.4%",
      width: "35%",
      marginTop: "3%",
      marginBottom: "3%"
    },
    green: {
      color: "#fff",
      backgroundColor: green[500],
      height: 45,
      width: 45,
      marginTop: "1rem",
      marginLeft: "1rem"
    },
    textUser: {
      color: "#e65100",
      fontSize: 18,
      marginBottom: "-0.4rem",
      position: "relative",
      left: "4.5rem",
      bottom: "2.7rem"
    },
    textDateCreation: {
      position: "relative",
      left: "4.5rem",
      bottom: "2.7rem"
    },
    numberOfLikes: {
      fontSize: 18,
      marginLeft: "1rem"
    },
    textComment: {
      marginLeft: "1rem",
      marginRight: "0.6rem",
      paddingLeft: "0.2rem"
    }
  })
);

export const InputCommentComponentExample: React.FC = () => {
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper className={classes.root1}>
        <Avatar variant="rounded" className={classes.green}>
          <PersonIcon
            style={{
              height: 40,
              width: 40
            }}
          />
        </Avatar>

        <div>
          {data.comments.map(
            (comment: {
              _id: string;
              postId: string;
              text: string;
              user_name: string;
            }) => (
              <div key={comment._id}>
                <Typography variant="body1" className={classes.textUser}>
                  {comment.user_name} says...
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.textDateCreation}
                >
                  Created on: 15.12.2019
                </Typography>
                <Typography
                  key={comment._id}
                  variant="body1"
                  color="textPrimary"
                  className={classes.textComment}
                >
                  {comment.text}
                </Typography>
              </div>
            )
          )}
        </div>
        <Divider style={{ position: "relative", top: "2.7rem" }} />
        <div
          style={{
            position: "relative",
            top: "1rem",
            marginTop: "2rem",
            marginBottom: "1rem",
            padding: "0.2rem",
            display: "flex",
            alignItems: "center"
          }}
        >
          <IconButton style={{ position: "relative", left: "1rem" }}>
            <Like />
          </IconButton>
          <Typography color="primary" className={classes.numberOfLikes}>
            100
          </Typography>
          <IconButton style={{ position: "relative", left: "20.5rem" }}>
            <ShareIcon />
          </IconButton>
          <Divider
            style={{
              transform: "rotate(90deg)",
              width: "2.5rem",
              position: "relative",
              left: "20rem"
            }}
          />
          <IconButton style={{ position: "relative", left: "19.5rem" }}>
            <ReplyIcon />
          </IconButton>
        </div>
      </Paper>
    </div>
  );
};
