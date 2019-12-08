import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { InputBlogComponent } from "../components/InputBlogComponent";

const useStyles = makeStyles({
  root: {
    width: "600px",
    overflowX: "auto",
    margin: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  table: {
    minWidth: 600
  },
  typography: {
    fontWeight: "bold",
    color: "#283593"
  }
});

// Code for queries

// query for showing all blogposts
const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description
    }
  }
`;
/*
    // Query for searching blog post by id field
    {
    blogPost(id:"5dd6fe3141e42c159433d722") {
      _id: 
      title
      description
    }
    }
    */

const REMOVE_MUTATION = gql`
  mutation($_id: ID!) {
    removeBlogPost(_id: $_id) {
      _id
    }
  }
`;

export const AddBlogPost: React.FC = () => {
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

  /*
  const [removeBlogPost, { error }] = useMutation(REMOVE_MUTATION);
    if (error) {
      console.log("error", error);
    }
    console.log("data:", data);
    if (loading || !data) {
      return null;
    }
    */

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <Typography
                  variant="h6"
                  component="h3"
                  className={classes.typography}
                >
                  Title
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography
                  variant="h6"
                  component="h3"
                  className={classes.typography}
                >
                  Description
                </Typography>
              </TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.blogPosts.map(
              (blog: {
                _id: string | number | undefined;
                title: string | number | undefined;
                description: string | number | undefined;
              }) => (
                <TableRow key={blog._id}>
                  <TableCell component="th" scope="row">
                    {blog.title}
                  </TableCell>
                  <TableCell align="left">{blog.description}</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        removeBlogPost({
                          variables: { _id: blog._id },
                          refetchQueries: [{ query: BLOGS_QUERY }]
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>
      <InputBlogComponent />
    </div>
  );
};
