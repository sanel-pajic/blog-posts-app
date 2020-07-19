import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "../components/CircularLoading";
import {
  Paper,
  Typography,
  CardMedia,
  Divider,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { CommentComponent } from "../components/CommentComponent";
import { AddCommentsComponent } from "../components/AddCommentsComponent";
import { FetchQueryAuthor } from "../components/FetchQueryAuthor";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import {
  ADD_BLOG_LIKE,
  REMOVE_BLOG_LIKE,
} from "../graphql-queries-mutations/mutations";
import * as R from "ramda";
import { ModalError } from "../components/ModalError";
import mongoID from "bson-objectid";
import { grey } from "@material-ui/core/colors";
import { SINGLE_BLOG_QUERY } from "../graphql-queries-mutations/queries";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: "50vh",
      width: "90%",
      marginBottom: "1%",
      marginTop: "2%",
    },
    cardMedia: {
      height: "30vh",
      width: "68%",
      marginBottom: "1%",
      marginTop: "2%",
      marginLeft: "16%",
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
    likeBlogMedia: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      backgroundColor: grey[50],
      height: theme.spacing(8),
    },
    divRoot: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "2%",
      marginBottom: "2%",
    },
    paper: { width: "50vw", minWidth: 600 },
    typographyTitle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "5%",
      wordWrap: "break-word",
    },
    divPublishedAuthor: {
      marginLeft: "5rem",
      position: "relative",
      top: "6vh",
      display: "flex",
    },
    divPublishedAuthorMedia: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "6vh",
    },
    typographyPublished: { fontWeight: "bolder", color: "#ff8a80" },
    typographyDate: {
      fontWeight: "bolder",
      marginLeft: "0.5rem",
      color: "#ff8a80",
    },
    typographyBy: {
      fontWeight: "bolder",
      marginLeft: "0.5rem",
      color: "#ff8a80",
    },
    typographyAuthor: {
      fontWeight: "bolder",
      marginLeft: "0.2rem",
      color: "#ff8a80",
    },
    typographyInfo: {
      paddingTop: "7%",
      paddingLeft: "6%",
      marginTop: "0.5%",
      marginBottom: "0.5%",
    },
    typographyInfoMedia: {
      marginTop: "3%",
      marginBottom: "1%",
      marginLeft: "19%",
      fontSize: "1.2rem",
    },
    typographyDescriptionShort: {
      paddingLeft: "3rem",
      wordWrap: "break-word",
      paddingRight: "3rem",
    },
    typographyDescriptionShortMedia: {
      wordWrap: "break-word",
      textAlign: "justify",
      marginLeft: "20%",
      marginRight: "20%",
    },
    image: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem",
    },
    imageMedia: {
      padding: "1rem",
    },
    typographyDescription: { padding: "3rem", wordWrap: "break-word" },
    typographyDescriptionMedia: {
      wordWrap: "break-word",
      textAlign: "justify",
      marginLeft: "20%",
      marginRight: "20%",
    },
    divLikeBlog: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "5vh",
    },
    likeIconButton: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "2vw",
    },
    divThumbUpIcon: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 60,
      height: 60,
    },
    divThumbUpIconMedia: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      height: 20,
      marginRight: 5,
    },
    typographyNumberLikes: { marginLeft: "1.5vw", marginRight: "2vw" },
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
  const currentUser: string | null = localStorage.getItem("userId");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

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
    REMOVE_BLOG_LIKE
  );

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

  if (loading || !data) {
    return <CircularLoading />;
  }

  //@ts-ignore
  const likeSingleBlog =
    data.blogPost.likes.findIndex(
      (like: { userId: string }) => like.userId === currentUser
    ) >= 0;

  const like = data.blogPost.likes.find((like: any) => {
    return like.userId === currentUser;
  });

  const dataBLOG = {
    numLikes: data.blogPost.likes.length,
    isLikedByCurrentUser: like != null,
    userLikeID: like ? like._id : null,
  };

  return (
    <div className={classes.divRoot}>
      <Paper className={classes.paper}>
        <Typography
          color="textPrimary"
          variant={matches ? "h3" : "h4"}
          className={classes.typographyTitle}
        >
          {data.blogPost.title}
        </Typography>
        <div
          className={
            matches
              ? classes.divPublishedAuthor
              : classes.divPublishedAuthorMedia
          }
        >
          <Typography variant="body1" className={classes.typographyPublished}>
            Published:
          </Typography>
          <Typography variant="body1" className={classes.typographyDate}>
            {handleDate(data.blogPost.date)}
          </Typography>
          <Typography variant="body1" className={classes.typographyBy}>
            by
          </Typography>
          <Typography
            component={"span"}
            variant="body1"
            className={classes.typographyAuthor}
          >
            <FetchQueryAuthor userID={data.blogPost.author} />
          </Typography>
        </div>
        <Typography
          color="primary"
          variant="h6"
          className={
            matches ? classes.typographyInfo : classes.typographyInfoMedia
          }
        >
          Short description: To read more scroll down!
        </Typography>
        <Typography
          color="textSecondary"
          variant={matches ? "h5" : "h6"}
          className={
            matches
              ? classes.typographyDescriptionShort
              : classes.typographyDescriptionShortMedia
          }
        >
          {data.blogPost.description_short}
        </Typography>

        <div className={matches ? classes.image : classes.imageMedia}>
          <CardMedia
            image={data.blogPost.image}
            title="Blog Post Image"
            className={matches ? classes.card : classes.cardMedia}
            component="div"
          />
        </div>
        <Typography
          color="textPrimary"
          variant={matches ? "h5" : "h6"}
          className={
            matches
              ? classes.typographyDescription
              : classes.typographyDescriptionShortMedia
          }
          dangerouslySetInnerHTML={{ __html: data.blogPost.description }}
        ></Typography>
        <div className={classes.divLikeBlog}>
          <Paper className={matches ? classes.likeBlog : classes.likeBlogMedia}>
            <Typography
              color="textSecondary"
              variant={matches ? "h6" : "subtitle1"}
            >
              If you like this post please press like!
            </Typography>
            <IconButton
              aria-label="add to favorites"
              className={classes.likeIconButton}
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
                      alert(error);
                    })
              }
            >
              <div
                className={
                  matches ? classes.divThumbUpIcon : classes.divThumbUpIconMedia
                }
              >
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
              className={classes.typographyNumberLikes}
              color="primary"
              variant={matches ? "h4" : "h5"}
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
