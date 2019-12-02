import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import * as yup from "yup";

let schema = yup.object().shape({
  title: yup
    .string()
    .required()
    .min(5),
  description: yup
    .string()
    .required()
    .min(5)
});

const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description
    }
  }
`;

const ADD_MUTATION = gql`
  mutation($data: BlogPostInput!) {
    addBlogPost(data: $data)
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: 200
      }
    }
  })
);

export const InputBlogComponent: React.FC = () => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data, loading } = useQuery(BLOGS_QUERY);

  const [addBlogPost, { error }] = useMutation(ADD_MUTATION);
  if (error) {
    console.log("error", error);
  }
  console.log("data:", data);
  if (loading || !data) {
    return null;
  }

  return (
    <div className="input-form">
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="title"
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          id="description"
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </form>
      <Button
        id="submitButton"
        color="primary"
        variant="contained"
        style={{ position: "relative", left: "450px", bottom: "50px" }}
        onClick={() => {
          try {
            const valid = schema.validateSync({
              title,
              description
            });
            console.log("VALID", valid);

            addBlogPost({
              variables: {
                data: {
                  _id: mongoID.generate(),
                  title,
                  description
                }
              },
              refetchQueries: [{ query: BLOGS_QUERY }]
            });
          } catch (error) {
            alert(error);
          }
        }}
      >
        ADD BLOG
      </Button>
    </div>
  );
};
