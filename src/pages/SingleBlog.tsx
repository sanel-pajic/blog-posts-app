import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "../components/CircularLoading";
import {
  Paper,
  Typography,
  CardMedia,
  Divider,
  IconButton,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { CommentComponent } from "../components/CommentComponent";
import { AddCommentsComponent } from "../components/AddCommentsComponent";
import { FetchQueryAuthor } from "../components/FetchQueryAuthor";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { ADD_BLOG_LIKE, REMOVE_BLOG_LIKE } from "../queries/mutations";
import * as R from "ramda";
import { ModalError } from "../components/ModalError";
import mongoID from "bson-objectid";
import { grey } from "@material-ui/core/colors";
import { SINGLE_BLOG_QUERY } from "../queries/queries";
import { useFetchQueryCurrentUser } from "../hooks/useFetchQueryCurrentUser";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: "50vh",
      width: "85vw",
    },
    likeBlog: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      backgroundColor: grey[50],
    },
  })
);

export function handleDate(dateString: string) {
  var date = new Date(dateString);
  let dd = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let mm = date.getMonth() + 1;
  let month = monthNames[date.getMonth()];
  let yyyy = date.getFullYear();
  if (dd < 10) {
    // @ts-ignore
    dd = "0" + dd;
  }
  if (mm < 10) {
    // @ts-ignore
    mm = "0" + mm;
  }

  const convertedDate = month + " " + dd + ", " + yyyy;
  return convertedDate;
}

export const SingleBlog: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const idFromHistory = match.params.id;

  const classes = useStyles();
  const currentUserData = useFetchQueryCurrentUser();

  const { data, loading } = useQuery(SINGLE_BLOG_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { postId: idFromHistory },
  });
  const [addBlogLike, { error }] = useMutation(ADD_BLOG_LIKE, {
    update: (cache, { data }) => {
      const previousData: any = cache.readQuery({
        query: SINGLE_BLOG_QUERY,
        variables: { postId: idFromHistory },
      });

      console.log("DATA QUERY", data, "PREVIOUS QUERY", previousData);

      cache.writeQuery({
        query: SINGLE_BLOG_QUERY,
        variables: { postId: idFromHistory },
        data: R.over(
          R.lensPath(["blogPost", "likes"]),
          R.append(data.addLikeBlog),
          previousData
        ),
      });
    },
  });

  const [removeBlogLike, { error: errorRemoveBlogLike }] = useMutation(
    REMOVE_BLOG_LIKE,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: SINGLE_BLOG_QUERY,
          variables: { postId: idFromHistory },
        });

        console.log(
          "DATA QUERY REMOVE BLOG LIKE",
          data,
          "PREVIOUS QUERY REMOVE BLOG LIKE",
          previousData
        );
      },
    }
  );

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

  if (loading || !data) {
    return <CircularLoading />;
  }
  // console.log("DATA ", data);

  const currentUser = currentUserData.toLocaleString();

  // console.log("CURRENT USER", currentUser);

  //@ts-ignore

  const likeSingleBlog =
    data.blogPost.likes.findIndex(
      (like: { userId: string }) => like.userId === currentUser
    ) >= 0;

  // console.log("SINGLE BLOG LIKE", likeSingleBlog);

  const like = data.blogPost.likes.find((like: any) => {
    return like.userId === currentUser;
  });

  const dataBLOG = {
    numLikes: data.blogPost.likes.length,
    isLikedByCurrentUser: like != null,
    userLikeID: like ? like._id : null,
  };

  // console.log("DATA BLOG", dataBLOG);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        marginBottom: "2%",
      }}
    >
      <Paper
        style={{
          width: "50vw",
          minWidth: 600,
        }}
      >
        <Typography
          color="textPrimary"
          variant="h3"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%",
            wordWrap: "break-word",
          }}
        >
          {data.blogPost.title}
        </Typography>
        <div
          style={{
            marginLeft: "5rem",
            position: "relative",
            top: "6vh",
            display: "flex",
          }}
        >
          <Typography
            variant="body1"
            style={{ fontWeight: "bolder", color: "#ff8a80" }}
          >
            Published:
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bolder",
              marginLeft: "0.5rem",
              color: "#ff8a80",
            }}
          >
            {handleDate(data.blogPost.date)}
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bolder",
              marginLeft: "0.5rem",
              color: "#ff8a80",
            }}
          >
            by
          </Typography>
          <Typography
            component={"span"}
            variant="body1"
            style={{
              fontWeight: "bolder",
              marginLeft: "0.2rem",
              color: "#ff8a80",
            }}
          >
            <FetchQueryAuthor userID={data.blogPost.author} />
          </Typography>
        </div>
        <Typography
          color="primary"
          variant="h6"
          style={{
            paddingTop: "3.5rem",
            paddingLeft: "3rem",
            marginTop: "0.5%",
            marginBottom: "0.5%",
          }}
        >
          Short description: To read more scroll down!
        </Typography>
        <Typography
          color="textSecondary"
          variant="h5"
          style={{
            paddingLeft: "3rem",
            wordWrap: "break-word",
            paddingRight: "3rem",
          }}
        >
          {data.blogPost.description_short}
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <CardMedia
            image={data.blogPost.image}
            title="Blog Post Image"
            className={classes.media}
            style={{ width: "90%", marginBottom: "1rem", marginTop: "1rem" }}
            component="div"
          />
        </div>
        <Typography
          color="textPrimary"
          variant="h5"
          style={{
            padding: "3rem",
            wordWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: data.blogPost.description }}
        ></Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5vh",
          }}
        >
          <Paper className={classes.likeBlog}>
            <Typography color="textSecondary" variant="h6">
              If you like this post please press like!
            </Typography>
            <IconButton
              aria-label="add to favorites"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "2vw",
              }}
              onClick={() =>
                dataBLOG.isLikedByCurrentUser
                  ? removeBlogLike({
                      variables: {
                        _id: dataBLOG.userLikeID,
                      },
                      refetchQueries: [
                        {
                          query: SINGLE_BLOG_QUERY,
                          variables: { postId: data.blogPost._id },
                        },
                      ],
                    }).catch((error) => {
                      console.log("ERROR REMOVE BLOG LIKE", error);
                      alert(error);
                    })
                  : addBlogLike({
                      variables: {
                        data: {
                          _id: mongoID.generate(),
                          blogId: idFromHistory,
                        },
                      },
                    }).catch((error) => {
                      console.log("ERROR ADD LIKE", error);
                    })
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 60,
                  height: 60,
                }}
              >
                {" "}
                <ThumbUpAltIcon
                  color={likeSingleBlog ? "primary" : "inherit"}
                />
                <Typography
                  color={likeSingleBlog ? "primary" : "inherit"}
                  variant="h6"
                >
                  LIKE
                </Typography>
              </div>
            </IconButton>
            <Typography
              style={{ marginLeft: "1.5vw", marginRight: "2vw" }}
              color="primary"
              variant="h4"
            >
              {data.blogPost.likes.length}
            </Typography>
          </Paper>
        </div>

        <Divider variant="fullWidth" style={{ marginBottom: "5%" }} />
        <AddCommentsComponent postId={idFromHistory} />
        <CommentComponent postId={idFromHistory} />
      </Paper>
    </div>
  );
};
