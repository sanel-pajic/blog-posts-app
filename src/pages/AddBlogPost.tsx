import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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
import Avatar from "@material-ui/core/Avatar";
import { blue } from "@material-ui/core/colors";
import { useProtectedPath } from "../components/useProtectedPath";
import { Redirect } from "react-router";
import { CircularLoading } from "../components/CircularLoading";
import { ModalError } from "../components/ModalError";
import { BLOGS_QUERY } from "../queries/queries";
import { ADD_BLOG_MUTATION } from "../queries/mutations";
import { DialogVisibleModal } from "../components/DialogVisibleModal";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "98.5%"
      }
    },
    avatar: {
      backgroundColor: blue[800],
      width: 60,
      height: 60,
      marginRight: "0.5vw"
    },
    blogTitle: {
      fontColor: blue[800],
      marginRight: "0.5vw"
    }
  })
);

export const AddBlogPost: React.FC = () => {
  const accessGrant = useProtectedPath();
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description_short, setDescriptionShort] = useState("");
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [image, setImageURL] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [blogIDState, setBlogIDState] = useState("");

  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const [addBlogPost, { error: errorAddBlogPost }] = useMutation(
    ADD_BLOG_MUTATION,
    {
      errorPolicy: "all",
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: BLOGS_QUERY
        });
        console.log(
          "DATA QUERY ADD BLOG POST",
          data,
          "PREVIOUS QUERY ADD BLOG POST",
          previousData
        );
      }
    }
  );
  if (errorAddBlogPost) {
    console.log("error", errorAddBlogPost);
    return (
      <div>
        {errorAddBlogPost.graphQLErrors.map(({ message }, i) => (
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

  const onChangeHandler = (description: EditorState) => {
    // const raw = convertToRaw(description.getCurrentContent());
    setDescription(description);
    // console.log(draftToHtml(raw));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "1%"
      }}
    >
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "58%",
          padding: "1.5%",
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant="h5" className={classes.blogTitle}>
            Add New
          </Typography>
          <Avatar aria-label="recipe" className={classes.avatar}>
            Blog
          </Avatar>
          <Typography variant="h5" className={classes.blogTitle}>
            Post
          </Typography>
        </div>
        <div
          style={{
            border: "1px solid #bdbdbd",
            margin: "4%",
            padding: "6%"
          }}
        >
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
              style={{ height: "10vh" }}
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
                wrapperStyle={{ color: "black", border: "1px solid #bdbdbd" }}
                editorStyle={{
                  color: "black",
                  borderTop: "1px solid #bdbdbd",
                  height: "40vh"
                }}
                onEditorStateChange={editorState =>
                  onChangeHandler(editorState)
                }
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
            <div style={{ marginRight: "5vw" }}>
              <CloudinaryWidget onUploadSuccess={setImageURL} />
            </div>
            <Button
              id="submitButton"
              color="primary"
              variant="contained"
              size="large"
              style={{ width: 140, marginLeft: "5vw" }}
              onClick={e => {
                const idBlog = mongoID.generate();
                setBlogIDState(idBlog);
                e.preventDefault();
                setTitle("");
                setDescriptionShort("");
                setDescription(EditorState.createEmpty());
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
                        _id: idBlog,
                        title,
                        description_short,
                        description: draftToHtml(
                          convertToRaw(description.getCurrentContent())
                        ),
                        image,
                        date: new Date()
                      }
                    },
                    refetchQueries: [{ query: BLOGS_QUERY }]
                  })
                    .then(() => setDialogVisible(true))
                    .catch(error => {
                      console.log("ERROR ADD BLOG POST", error);
                    });
                } catch (error) {
                  alert(error);
                }
              }}
            >
              ADD BLOG
            </Button>
            <DialogVisibleModal
              dialogVisible={dialogVisible}
              message="Successful added new Blog."
              blogID={blogIDState}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};
