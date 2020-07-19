import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useQuery, useMutation } from "@apollo/react-hooks";
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
import { CircularLoading } from "./CircularLoading";
import { useHistory } from "react-router-dom";
import { BLOGS_QUERY } from "../graphql-queries-mutations/queries";
import {
  REMOVE_BLOG_MUTATION,
  ADD_BLOG_LIKE,
  REMOVE_BLOG_LIKE,
} from "../graphql-queries-mutations/mutations";
import { useProtectedPath } from "../hooks/useProtectedPath";
import { Redirect } from "react-router";
import mongoID from "bson-objectid";
import * as R from "ramda";
import { ModalError } from "./ModalError";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      height: "auto",
      minWidth: 300,
      maxWidth: 400,
      marginTop: "5vh",
    },
    media: {
      paddingTop: "56.25%",
    },
    avatar: {
      backgroundColor: blue[800],
      width: 60,
      height: 60,
    },
    descriptionTypography: {
      marginLeft: 20,
      textDecoration: "underline",
    },
    descriptionShortTypography: { wordWrap: "break-word" },
    removeIcon: { marginLeft: "1%" },
    button: {
      color: "#1565c0",
      textTransform: "none",
      fontSize: "20px",
      marginLeft: "5%",
    },
    cardActions: {
      display: "flex",
      justifyContent: "space-around",
      width: 390,
    },
  })
);

export const BlogList: React.FC = () => {
  const classes = useStyles();
  let history = useHistory();
  const currentUser: string | null = localStorage.getItem("userId");

  function handleClick(id: string) {
    history.push(`singleblog/${id}`);
  }

  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const accessGrant = useProtectedPath();

  const [removeBlogPost, { error }] = useMutation(REMOVE_BLOG_MUTATION);

  const [addBlogLike, { error: addBlogLikeError }] = useMutation(
    ADD_BLOG_LIKE,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: BLOGS_QUERY,
        });

        const blogIdx: any = previousData.blogPosts.findIndex(
          (blog: { _id: any }) => {
            return blog._id === data.addLikeBlog.blogId;
          }
        );

        cache.writeQuery({
          query: BLOGS_QUERY,
          data: R.over(
            R.lensProp("blogPosts"),
            R.over(
              R.lensIndex(blogIdx),
              R.over(R.lensProp("likes"), R.append(data.addLikeBlog))
            ),
            previousData
          ),
        });
      },
    }
  );

  const [removeBlogLike, { error: errorRemoveBlogLike }] = useMutation(
    REMOVE_BLOG_LIKE
  );

  if (!accessGrant) {
    return <Redirect to="/authorize" />;
  }

  if (loading || !data) {
    return <CircularLoading />;
  }

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

  if (addBlogLikeError) {
    return (
      <div>
        {addBlogLikeError.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <ModalError message={message} />
          </div>
        ))}
      </div>
    );
  }

  if (errorRemoveBlogLike) {
    return (
      <div>
        {errorRemoveBlogLike.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <ModalError message={message} />
          </div>
        ))}
      </div>
    );
  }

  //@ts-ignore
  const dataBlogPosts = data.blogPosts.map((blog: any) => {
    const like = blog.likes.find(
      (like: { userId: string }) => like.userId === currentUser
    );
    return {
      numLikes: blog.likes.length,
      isLikedByCurrentUser: like != null,
      blogId: blog._id,
      userLikeID: like ? like._id : null,
    };
  });

  const possibleDeleteBlogs = data.blogPosts.map((blog: any) => {
    return {
      user: blog.author,
      possibleDelete: blog.author === currentUser,
    };
  });

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={5}>
          {data.blogPosts.map(
            (
              blog: {
                _id: string;
                title: string;
                description_short: string;
                description: string;
                image: string;
                likes: any;
              },
              index: any
            ) => (
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
                    image={`${blog.image}`}
                    title="Blog Post Image"
                    component="div"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      className={classes.descriptionTypography}
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      className={classes.descriptionShortTypography}
                    >
                      {blog.description_short}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing className={classes.cardActions}>
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => {
                        dataBlogPosts[index].isLikedByCurrentUser
                          ? removeBlogLike({
                              variables: {
                                _id: dataBlogPosts[index].userLikeID,
                              },
                              refetchQueries: [{ query: BLOGS_QUERY }],
                            }).catch((error) => {
                              alert(error);
                            })
                          : addBlogLike({
                              variables: {
                                data: {
                                  _id: mongoID.generate(),
                                  blogId: blog._id,
                                },
                              },
                            }).catch((error) => {
                              alert(error);
                            });
                      }}
                    >
                      <FavoriteIcon
                        color={
                          dataBlogPosts[index].isLikedByCurrentUser
                            ? "primary"
                            : "inherit"
                        }
                      />
                    </IconButton>
                    <IconButton aria-label="share">
                      <Typography variant="h6" color="primary">
                        {blog.likes.length}
                      </Typography>
                    </IconButton>
                    <IconButton
                      className={classes.removeIcon}
                      onClick={() =>
                        removeBlogPost({
                          variables: { _id: blog._id },
                          refetchQueries: [{ query: BLOGS_QUERY }],
                        }).catch((error) => {
                          alert(error);
                        })
                      }
                    >
                      {possibleDeleteBlogs[index].possibleDelete ? (
                        <DeleteIcon color={"primary"} />
                      ) : null}
                    </IconButton>

                    <Button
                      size="large"
                      color="primary"
                      className={classes.button}
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
