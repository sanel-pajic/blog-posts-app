import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

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
    fontWeight: "bold"
  }
});

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

export const BlogsList: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useQuery(BLOGS_QUERY);
  console.log("data:", data);
  if (loading || !data) {
    return null;
  }

  return (
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
                TITLE
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography
                variant="h6"
                component="h3"
                className={classes.typography}
              >
                DESCRIPTION
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography
                variant="h6"
                component="h3"
                className={classes.typography}
              >
                BUTTON
              </Typography>
            </TableCell>
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
                <TableCell align="right"></TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};
