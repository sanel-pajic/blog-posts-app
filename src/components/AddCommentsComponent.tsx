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
  withStyles,
} from "@material-ui/core";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { teal } from "@material-ui/core/colors";
import { useProtectedPath } from "../hooks/useProtectedPath";
import { Redirect } from "react-router";
import { CircularLoading } from "./CircularLoading";
import { ADD_COMMENT } from "../graphql-queries-mutations/mutations";
import { ModalError } from "./ModalError";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "2%",
      width: "100%",
      marginTop: "3%",
      marginBottom: "4%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    },

    margin: {
      margin: theme.spacing(1),
    },
    divRoot: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%",
    },
    textFieldComment: { width: "100%" },
    commentTypography: {
      marginLeft: "3%",
      marginBottom: "1%",
      marginTop: "1%",
    },
    button: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: "5%",
    },
    divider: { marginBottom: "10%", marginTop: "5%" },
  })
);

export const ColorButtonTeal = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[300],
    "&:hover": {
      backgroundColor: teal[500],
    },
  },
}))(Button);

function scrollToForm(id: string) {
  document?.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export const AddCommentsComponent: React.FC<{ postId: string }> = ({
  postId,
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
    fetchPolicy: "cache-and-network",
  });
  const [addComment, { error }] = useMutation(ADD_COMMENT);
  if (error) {
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

  const handleClick = (id: string) => {
    setText("");
    setTimeout(() => {
      scrollToForm(id);
    }, 100);
  };

  return (
    <div>
      <div className={classes.divRoot}>
        <Paper className={classes.root}>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.commentTypography}
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
            onChange={(e) => setText(e.target.value)}
            className={classes.textFieldComment}
          />
          <div className={classes.button}>
            <ColorButtonTeal
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
                      date: new Date(),
                    },
                  },
                  refetchQueries: [{ query: COMMENTS_QUERY }],
                })
                  .then((res) => handleClick(res.data.addComment._id))
                  .catch((error) => {
                    alert(error);
                  });
              }}
            >
              POST A COMMENT
            </ColorButtonTeal>
          </div>
        </Paper>
      </div>
      <Divider variant="fullWidth" className={classes.divider} />
    </div>
  );
};
