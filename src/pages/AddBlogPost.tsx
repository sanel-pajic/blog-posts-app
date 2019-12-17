import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import * as yup from "yup";
import { Paper, Typography } from "@material-ui/core";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import { CloudinaryWidget } from "../components/CloudinaryWidget";
import draftToHtml from "draftjs-to-html";

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
      description_short
      description
      image
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
        width: "98.5%"
      }
    }
  })
);

export const AddBlogPost: React.FC = () => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description_short, setDescriptionShort] = useState("");
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [image, setImageURL] = useState("");

  const { data, loading } = useQuery(BLOGS_QUERY);

  const [addBlogPost, { error }] = useMutation(ADD_MUTATION);
  if (error) {
    console.log("error", error);
  }

  if (loading || !data) {
    return null;
  }

  const onChangeHandler = (description: EditorState) => {
    const raw = convertToRaw(description.getCurrentContent());
    setDescription(description);
    console.log(draftToHtml(raw));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3%"
      }}
    >
      <Paper
        style={{
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          padding: "1%"
        }}
      >
        <Typography variant="h5" color="primary">
          Add New Blog Post
        </Typography>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="title"
            label="Title"
            placeholder="Title: Min 5 characters"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextareaAutosize
            id="description_short"
            aria-label="minimum height"
            placeholder="Short Description: Min 100 characters"
            style={{ height: 80 }}
            value={description_short}
            onChange={e => setDescriptionShort(e.target.value)}
          />
          <div>
            <Editor
              editorState={description}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              placeholder="Description"
              wrapperStyle={{ color: "black" }}
              editorStyle={{
                color: "black",
                border: "1px solid grey",
                height: 250
              }}
              onEditorStateChange={editorState => onChangeHandler(editorState)}
            />
          </div>
        </form>
        <div
          style={{
            padding: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <CloudinaryWidget onUploadSuccess={setImageURL} />
          <Button
            id="submitButton"
            color="primary"
            variant="contained"
            style={{ width: 120, marginLeft: 100 }}
            onClick={() => {
              try {
                const valid = schema.validateSync({
                  title,
                  description_short,
                  description
                });
                console.log("VALID", valid);

                addBlogPost({
                  variables: {
                    data: {
                      _id: mongoID.generate(),
                      title,
                      description_short,
                      description: draftToHtml(
                        convertToRaw(description.getCurrentContent())
                      ),
                      image
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
      </Paper>
    </div>
  );
};
