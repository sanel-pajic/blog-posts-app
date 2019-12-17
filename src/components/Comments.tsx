import React, { useState } from "react";
import {
  TextField,
  Paper,
  createStyles,
  makeStyles,
  Theme,
  IconButton,
  Button,
  Avatar,
  Typography
} from "@material-ui/core";
import Like from "@material-ui/icons/ThumbUpAltOutlined";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PersonIcon from "@material-ui/icons/Person";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2%",
      width: "60%",
      marginTop: "3%",
      marginBottom: "3%",
      background: "#f5f5f5"
    },
    root1: {
      padding: "2%",
      width: "80%",
      marginTop: "3%",
      marginBottom: "3%"
    },
    green: {
      color: "#fff",
      backgroundColor: green[500]
    }
  })
);

const COMMENTS_QUERY = gql`
  query {
    comments(postId: "5df69ce8d0615623ba5f138e") {
      _id
      postId
      text
    }
  }
`;

const ADD_COMMENT = gql`
  mutation($data: CommentInput!) {
    addComment(data: $data)
  }
`;

export const Comments: React.FC = () => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { data, loading } = useQuery(COMMENTS_QUERY);
  const [addComment, { error }] = useMutation(ADD_COMMENT);
  if (error) {
    console.log("error", error);
  }

  if (loading || !data) {
    return null;
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Paper className={classes.root}>
          <TextField
            id="comment"
            label="Comment"
            placeholder="Write a comment"
            multiline
            rows="4"
            variant="outlined"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{
              width: "100%"
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "3%", marginLeft: "60%" }}
              onClick={() => {
                addComment({
                  variables: {
                    data: {
                      _id: mongoID.generate(),
                      postId: mongoID.generate(),
                      text
                    }
                  },
                  refetchQueries: [{ query: COMMENTS_QUERY }]
                });
              }}
            >
              ADD COMMENT
            </Button>
          </div>
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Paper className={classes.root1}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                height: 150
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    right: "1vw"
                  }}
                >
                  <Avatar className={classes.green}>
                    <PersonIcon
                      style={{
                        height: 30,
                        width: 30
                      }}
                    />
                  </Avatar>
                  <div
                    style={{
                      position: "relative",
                      left: "2rem",
                      bottom: "0.2vh"
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      User Name
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Created on: 15.12.2019
                    </Typography>
                  </div>
                </div>
                <IconButton
                  style={{ position: "relative", top: "5.5vh", right: "1.5vw" }}
                >
                  <Like />
                </IconButton>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #f5f5f5",
                width: "23vw",
                height: "8vh",
                position: "relative",
                top: "1.5vh",
                left: "0.5vw"
              }}
            >
              <div>
                {data.comments.map(
                  (comment: { _id: string; postId: string; text: string }) => (
                    <Typography
                      key={comment._id}
                      variant="body1"
                      color="textPrimary"
                      style={{ margin: "1rem" }}
                    >
                      {comment.text}
                    </Typography>
                  )
                )}
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};
