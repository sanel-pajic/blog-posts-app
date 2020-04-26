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
  REMOVE_BLOG_LIKE
} from "../graphql-queries-mutations/mutations";
import { useProtectedPath } from "../hooks/useProtectedPath";
import { Redirect } from "react-router";
import mongoID from "bson-objectid";
import * as R from "ramda";
import { useFetchQueryCurrentUser } from "../hooks/useFetchQueryCurrentUser";
import { ModalError } from "./ModalError";

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

export const BlogList: React.FC = () => {
  const classes = useStyles();
  let history = useHistory();
  const currentUserData = useFetchQueryCurrentUser();

  function handleClick(id: string) {
    history.push(`singleblog/${id}`);
  }

  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const accessGrant = useProtectedPath();

  const [removeBlogPost, { error }] = useMutation(REMOVE_BLOG_MUTATION);

  const [addBlogLike, { error: addBlogLikeError }] = useMutation(
    ADD_BLOG_LIKE,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: BLOGS_QUERY
        });

        console.log("DATA QUERY", data, "PREVIOUS QUERY", previousData);
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
          )
        });
      }
    }
  );

  const [removeBlogLike, { error: errorRemoveBlogLike }] = useMutation(
    REMOVE_BLOG_LIKE,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: BLOGS_QUERY
        });

        console.log(
          "DATA QUERY REMOVE BLOG LIKE",
          data,
          "PREVIOUS QUERY REMOVE BLOG LIKE",
          previousData
        );
      }
    }
  );

  if (!accessGrant) {
    return <Redirect to="/authorize" />;
  }

  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    console.log("error", error);
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
    console.log("error", addBlogLikeError);
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
    console.log("error", errorRemoveBlogLike);
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

  const currentUser = currentUserData.toLocaleString();

  //@ts-ignore
  const dataBlogPosts = data.blogPosts.map((blog: any) => {
    const like = blog.likes.find(
      (like: { userId: string }) => like.userId === currentUser
    );
    return {
      numLikes: blog.likes.length,
      isLikedByCurrentUser: like != null,
      blogId: blog._id,
      userLikeID: like ? like._id : null
    };
  });

  // console.log("DATA BLOG POSTS", dataBlogPosts);
  // console.log("DATA LIST", data);

  const possibleDeleteBlogs = data.blogPosts.map((blog: any) => {
    return {
      user: blog.author,
      possibleDelete: blog.author === currentUser
    };
  });

  //console.log("DATA DELETE BLOG POSTS", possibleDeleteBlogs);

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
                      style={{ wordWrap: "break-word" }}
                    >
                      {blog.description_short}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => {
                        dataBlogPosts[index].isLikedByCurrentUser
                          ? removeBlogLike({
                              variables: {
                                _id: dataBlogPosts[index].userLikeID
                              },
                              refetchQueries: [{ query: BLOGS_QUERY }]
                            }).catch(error => {
                              console.log("ERROR REMOVE BLOG LIKE", error);
                              alert(error);
                            })
                          : addBlogLike({
                              variables: {
                                data: {
                                  _id: mongoID.generate(),
                                  blogId: blog._id
                                }
                              }
                            }).catch(error => {
                              console.log("ERROR ADD LIKE", error);
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
                      style={{ marginLeft: "1%" }}
                      onClick={() =>
                        removeBlogPost({
                          variables: { _id: blog._id },
                          refetchQueries: [{ query: BLOGS_QUERY }]
                        }).catch(error => {
                          console.log("ERROR REMOVE BLOG", error);
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
