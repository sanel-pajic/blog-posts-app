import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { Typography, Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import { blue } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { CircularLoading } from "./CircularLoading";
import { ErrorLoading } from "./ErrorLoading";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    control: {
      padding: theme.spacing(2)
    },
    card: {
      height: "auto",
      width: 450,
      marginTop: "5vh"
    },
    media: {
      paddingTop: "56.25%"
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: blue[800],
      width: 60,
      height: 60
    }
  })
);

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

const REMOVE_MUTATION = gql`
  mutation($_id: ID!) {
    removeBlogPost(_id: $_id) {
      _id
    }
  }
`;

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

export const BlogList: React.FC = () => {
  const classes = useStyles();
  let history = useHistory();

  function handleClick(id: string) {
    history.push(`singleblog/${id}`);
  }

  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "network-only"
  });

  const [removeBlogPost, { error }] = useMutation(REMOVE_MUTATION);
  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    console.log("error", error);
    return <ErrorLoading />;
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={5}>
          {data.blogPosts.map(
            (blog: {
              _id: string;
              title: string;
              description_short: string;
              description: string;
              image: string;
            }) => (
              <Grid key={blog._id} item>
                <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe" className={classes.avatar}>
                        Blog
                      </Avatar>
                    }
                    title={
                      <Typography variant="h5">Title: {blog.title}</Typography>
                    }
                  />
                  <CardMedia
                    className={classes.media}
                    image={blog.image}
                    src={`${blog.image}`}
                    title="Blog Post Image"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      style={{
                        marginLeft: 20,
                        textDecoration: "underline"
                      }}
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {blog.description_short}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      style={{ marginLeft: "1%" }}
                      onClick={() =>
                        removeBlogPost({
                          variables: { _id: blog._id },
                          refetchQueries: [{ query: BLOGS_QUERY }]
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Button
                      size="large"
                      color="primary"
                      style={{
                        marginLeft: "15%",
                        color: "#1565c0",
                        textTransform: "none",
                        fontSize: "20px"
                      }}
                      onClick={() => handleClick(blog._id)}
                    >
                      Continue reading ...
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
