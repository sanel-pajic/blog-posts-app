import React, { useState } from "react";
import {
  TextField,
  Paper,
  createStyles,
  makeStyles,
  Theme,
  Button,
  Typography,
  Divider,
  withStyles
} from "@material-ui/core";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { teal } from "@material-ui/core/colors";
import { useProtectedPath } from "./useProtectedPath";
import { Redirect } from "react-router";
import { CircularLoading } from "./CircularLoading";
import { ADD_COMMENT } from "../queries/mutations";
import { ModalError } from "./ModalError";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2%",
      width: "60%",
      marginTop: "3%",
      marginBottom: "4%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
    },

    margin: {
      margin: theme.spacing(1)
    }
  })
);

export const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[300],
    "&:hover": {
      backgroundColor: teal[500]
    }
  }
}))(Button);

export const AddCommentsComponent: React.FC<{ postId: string }> = ({
  postId
}) => {
  const accessGrant = useProtectedPath();

  const COMMENTS_QUERY = gql`
  query {
    comments(postId: "${postId}") {
      _id
      postId
      text
      author
      date
      likes {
        _id
        commentId
        userId
      }
    }
  }
`;

  const classes = useStyles();
  const [text, setText] = useState("");
  const { data, loading } = useQuery(COMMENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const [addComment, { error }] = useMutation(ADD_COMMENT);
  if (error) {
    console.log("error", error);
    return (
      <div>
        {error.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <ModalError message={message} />
          </div>
        ))}
      </div>
    );
  }

  if (loading || !data) {
    return <CircularLoading />;
  }

  if (!accessGrant) {
    return <Redirect to="/authorize" />;
  }

  const refs = data.comments.reduce(
    (
      acc: { [x: string]: React.RefObject<unknown> },
      val: { _id: React.ReactText }
    ) => {
      acc[val._id] = React.createRef();
      return acc;
    },
    {}
  );

  console.log("REFS", refs);

  const handleClick = (id: string) => {
    setText("");
    console.log("CLG HANDLE CLICK", id);
    refs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

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
          <Typography
            variant="subtitle2"
            color="textSecondary"
            style={{ marginLeft: "1rem", marginBottom: "0.5rem" }}
          >
            COMMENT
          </Typography>
          <TextField
            id="comment"
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
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "5%"
            }}
          >
            <ColorButton
              variant="text"
              color="inherit"
              className={classes.margin}
              onClick={() => {
                const id = mongoID.generate();
                addComment({
                  variables: {
                    data: {
                      _id: id,
                      postId: postId,
                      text,
                      date: new Date()
                    }
                  },
                  refetchQueries: [{ query: COMMENTS_QUERY }]
                })
                  .then(() => handleClick(id))
                  .catch(error => {
                    console.log("ERROR ADD COMMENT", error);
                 
                  });
              }}
            >
              POST A COMMENT
            </ColorButton>
          </div>
        </Paper>
      </div>
      <Divider
        variant="fullWidth"
        style={{ marginBottom: "10%", marginTop: "5%" }}
      />
    </div>
  );
};
