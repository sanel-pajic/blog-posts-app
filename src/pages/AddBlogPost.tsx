import React, { useState } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  Avatar,
} from "@material-ui/core";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import * as yup from "yup";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import { CloudinaryWidget } from "../components/CloudinaryWidget";
import draftToHtml from "draftjs-to-html";
import { blue } from "@material-ui/core/colors";
import { useProtectedPath } from "../hooks/useProtectedPath";
import { Redirect } from "react-router";
import { CircularLoading } from "../components/CircularLoading";
import { ModalError } from "../components/ModalError";
import { BLOGS_QUERY } from "../graphql-queries-mutations/queries";
import { ADD_BLOG_MUTATION } from "../graphql-queries-mutations/mutations";
import { DialogVisibleModal } from "../components/DialogVisibleModal";

let schema = yup.object().shape({
  title: yup.string().required("Title is required field.").min(5,"Title must be at least 5 characters."),
  description: yup.string().required("Description is required field.").min(5, "Description must be at least 5 characters."),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "98.5%",
      },
    },
    avatar: {
      backgroundColor: blue[800],
      width: 60,
      height: 60,
      marginRight: "0.5vw",
    },
    blogTitle: {
      fontColor: blue[800],
      marginRight: "0.5vw",
    },
    paperRoot: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "58%",
      padding: "1.5%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    },
    paperRootMedia: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "1.5%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    },
    divRoot: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "1%",
    },
    titleItems: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    frameMain: { border: "1px solid #bdbdbd", margin: "4%", padding: "6%" },
    widgetButtonTogether: {
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    widgetButtonTogetherMedia: {
      padding: 10,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    cloudinaryWidget: {
      marginRight: "5vw",
    },
    addBlogButton: {
      width: 140,
      marginLeft: "5vw",
    },
    addBlogButtonMedia: {
      width: 120,
    },
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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [
    addBlogPost,
    { error: errorAddBlogPost, data: mutationData },
  ] = useMutation(ADD_BLOG_MUTATION, {
    errorPolicy: "all",
  });
  if (errorAddBlogPost) {
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
    setDescription(description);
  };

  return (
    <div className={classes.divRoot}>
      <Paper className={matches ? classes.paperRoot : classes.paperRootMedia}>
        <div className={classes.titleItems}>
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

        <div className={classes.frameMain}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="title"
              label="Title"
              placeholder="Title: Min 5 characters"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              id="description_short"
              placeholder="Short Description: Min 100 characters"
              value={description_short}
              multiline
              rows={4}
              variant="outlined"
              label="Short Description"
              onChange={(e) => setDescriptionShort(e.target.value)}
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
                  height: "40vh",
                }}
                onEditorStateChange={(editorState) =>
                  onChangeHandler(editorState)
                }
              />
            </div>
          </form>
          <div
            className={
              matches
                ? classes.widgetButtonTogether
                : classes.widgetButtonTogetherMedia
            }
          >
            <div className={matches ? classes.cloudinaryWidget : undefined}>
              <CloudinaryWidget onUploadSuccess={setImageURL} />
            </div>
            <Button
              id="submitButton"
              color="primary"
              variant="contained"
              size={matches ? "large" : "small"}
              className={
                matches ? classes.addBlogButton : classes.addBlogButtonMedia
              }
              onClick={(e) => {
                const idBlog = mongoID.generate();
                e.preventDefault();
                setTitle("");
                setDescriptionShort("");
                setDescription(EditorState.createEmpty());
                try {
                  const valid = schema.validateSync({
                    title,
                    description_short,
                    description,
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
                        date: new Date(),
                      },
                    },
                    refetchQueries: [{ query: BLOGS_QUERY }],
                  })
                    .then(() => setDialogVisible(true))
                    .catch((error) => {
                      alert(error);
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
              blogID={mutationData && mutationData.addBlogPost._id}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};
