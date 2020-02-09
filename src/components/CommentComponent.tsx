import React from "react";
import {
  Paper,
  createStyles,
  makeStyles,
  Theme,
  IconButton,
  Avatar,
  Typography,
  Divider
} from "@material-ui/core";
import Like from "@material-ui/icons/ThumbUpAltOutlined";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import PersonIcon from "@material-ui/icons/Person";
import { green } from "@material-ui/core/colors";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root1: {
      padding: "0.4%",
      width: "86%",
      marginTop: "1%",
      marginBottom: "5%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
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

export const CommentComponent: React.FC<{ postId: string }> = ({ postId }) => {
  const COMMENTS_QUERY = gql`
  query {
    comments(postId: "${postId}") {
      _id
      postId
      text
      user_name
    }
  }
`;
  const classes = useStyles();
  const { data, loading } = useQuery(COMMENTS_QUERY);
  if (loading || !data) {
    return null;
  }
  return (
    <div>
      {data.comments.map(
        (comment: {
          _id: string;
          postId: string;
          text: string;
          user_name: string;
        }) => (
          <div key={comment._id}>
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
                      style={{ wordWrap: "break-word" }}
                    >
                      {comment.text}
                    </Typography>
                  </div>
                </div>
                <Divider style={{ position: "relative", top: "5.5vh" }} />
                <div
                  style={{
                    position: "relative",
                    top: "2vh",
                    marginTop: "4.4%",
                    marginBottom: "2.2%",
                    padding: "0.2%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <IconButton>
                      <Like />
                    </IconButton>
                    <Typography
                      color="primary"
                      className={classes.numberOfLikes}
                    >
                      100
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "3%"
                    }}
                  >
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                    <Divider
                      style={{
                        transform: "rotate(90deg)",
                        width: "45%"
                      }}
                    />
                    <IconButton>
                      <ReplyIcon />
                    </IconButton>
                  </div>
                </div>
              </Paper>
            </div>
            <Divider
              variant="fullWidth"
              style={{ marginBottom: "10%", marginTop: "8%" }}
            />
          </div>
        )
      )}
    </div>
  );
};
