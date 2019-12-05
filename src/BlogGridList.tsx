import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import imageDog from "./images/dog.jpg";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "hidden",
      padding: theme.spacing(0, 3)
    },
    paper: {
      maxWidth: 600,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2)
    }
  })
);

const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description
    }
  }
`;

const REMOVE_MUTATION = gql`
  mutation($_id: ID!) {
    removeBlogPost(_id: $_id) {
      _id
    }
  }
`;

const message = `Truncation should be conditionally applicable on this long line of text
 as this is a much longer line than what the container can support. `;

export const BlogGridList: React.FC = () => {
  const classes = useStyles();

  const { data, loading } = useQuery(BLOGS_QUERY);
  console.log("data TABLE:", data);
  const [removeBlogPost, { error }] = useMutation(REMOVE_MUTATION);
  if (loading || !data) {
    return null;
  }
  if (error) {
    console.log("error", error);
  }

  return (
    <div className={classes.root}>
      {data.blogPosts.map(
        (blog: {
          _id: string | number | undefined;
          title: string | number | undefined;
          description: string | number | undefined;
        }) => (
          <Paper className={classes.paper}>
            <Typography variant="h4" style={{ marginBottom: 10 }}>
              Title: {blog.title}
            </Typography>
            <Grid container wrap="nowrap" spacing={3}>
              <Grid item>
                <img alt="complex" src={imageDog} />
              </Grid>

              <Grid item xs>
                <Typography
                  gutterBottom
                  variant="h5"
                  style={{ fontWeight: "bold" }}
                >
                  Description
                </Typography>
                <Typography>{blog.description}</Typography>
              </Grid>
              <IconButton
                style={{ marginTop: 140, position: "relative", right: 10 }}
                onClick={() =>
                  removeBlogPost({
                    variables: { _id: blog._id },
                    refetchQueries: [{ query: BLOGS_QUERY }]
                  })
                }
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Paper>
        )
      )}
    </div>
  );
};
