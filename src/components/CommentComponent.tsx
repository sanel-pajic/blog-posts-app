import React from "react";
import {
  Paper,
  createStyles,
  makeStyles,
  Theme,
  IconButton,
  Avatar,
  Typography,
  Divider
} from "@material-ui/core";
import Like from "@material-ui/icons/ThumbUpAltOutlined";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PersonIcon from "@material-ui/icons/Person";
import { green } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import ReplyIcon from "@material-ui/icons/Reply";
import { handleDate } from "../pages/SingleBlog";
import { CircularLoading } from "./CircularLoading";
import {
  ADD_COMMENT_LIKE,
  REMOVE_COMMENT_MUTATION,
  REMOVE_COMMENT_LIKE
} from "../queries/mutations";
import mongoID from "bson-objectid";
import { FetchQueryAuthor } from "./FetchQueryAuthor";
import { ModalError } from "./ModalError";
import { CommentLikeData } from "./CommentLikeData";
import { COMMENTS_QUERY } from "../queries/queries";
import * as R from "ramda";
import { useFetchQueryCurrentUser } from "./useFetchQueryCurrentUser";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root1: {
      padding: "0.4%",
      width: "86%",
      marginTop: "1%",
      marginBottom: "5%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
    },
    green: {
      color: "#fff",
      backgroundColor: green[500],
      height: 45,
      width: 45,
      marginTop: "1rem",
      marginLeft: "1rem"
    },
    textUser: {
      color: "#e65100",
      fontSize: 18,
      marginBottom: "-0.4rem",
      position: "relative",
      left: "4.5rem",
      bottom: "2.7rem"
    },
    textDateCreation: {
      position: "relative",
      left: "4.5rem",
      bottom: "2.7rem"
    },
    numberOfLikes: {
      fontSize: 20,
      marginLeft: "0.8rem",
      fontWeight: "bold"
    },
    textComment: {
      marginLeft: "1rem",
      marginRight: "0.6rem",
      paddingLeft: "0.2rem"
    }
  })
);

export const CommentComponent: React.FC<{ postId: string }> = ({ postId }) => {
  const classes = useStyles();
  const currentUserData = useFetchQueryCurrentUser();
  const { data, loading } = useQuery(COMMENTS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { postId }
  });
  const [removeComment] = useMutation(REMOVE_COMMENT_MUTATION);
  const [addCommentLike, { error }] = useMutation(ADD_COMMENT_LIKE, {
    update: (cache, { data }) => {
      const previousData: any = cache.readQuery({
        query: COMMENTS_QUERY,
        variables: { postId }
      });

      console.log("DATA QUERY", data, "PREVIOUS QUERY", previousData);
      const commentIdx: any = previousData.comments.findIndex(
        (comment: { _id: any }) => {
          return comment._id === data.addLikeComment.commentId;
        }
      );

      cache.writeQuery({
        query: COMMENTS_QUERY,
        variables: { postId },
        data: R.over(
          R.lensProp("comments"),
          R.over(
            R.lensIndex(commentIdx),
            R.over(R.lensProp("likes"), R.append(data.addLikeComment))
          ),
          previousData
        )
      });
    }
  });
  const [removeCommentLike] = useMutation(REMOVE_COMMENT_LIKE, {
    update: (cache, { data }) => {
      const previousData: any = cache.readQuery({
        query: COMMENTS_QUERY,
        variables: { postId }
      });

      console.log(
        "DATA QUERY REMOVE COMMENT LIKE",
        data,
        "PREVIOUS QUERY REMOVE COMMENT LIKE",
        previousData
      );
      const commentIdx: any = previousData.comments.findIndex(
        (comment: { _id: any }) => {
          return comment._id === data.removeLikeComment.commentId;
        }
      );

      console.log("COMMENT Idx REMOVE", commentIdx);

      cache.writeQuery({
        query: COMMENTS_QUERY,
        variables: { postId },
        data: R.over(
          R.lensProp("comments"),
          R.over(
            R.lensIndex(commentIdx),
            R.over(R.lensProp("likes"), R.append(data.addLikeComment))
          ),
          previousData
        )
      });
    }
  });
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

  if (loading || !data) {
    return <CircularLoading />;
  }

  const currentUser = currentUserData.toLocaleString();

  //@ts-ignore
  const dataLikeComments = data.comments.map((comment: any) => {
    return {
      numLikes: comment.likes.length,
      isLikedByCurrentUser:
        comment.likes.findIndex(
          (like: { userId: string }) => like.userId === currentUser
        ) >= 0,
      commentId: comment._id
    };
  });
  //console.log("DATA LIKE COMMENTS", dataLikeComments);
  //console.log("DATA COMMENTS", data);
  const dataDeleteComments = data.comments.map((comment: any) => {
    return {
      user: comment.author,
      possibleDelete: comment.author === currentUser
    };
  });
  console.log("DATA DELETE COMMENTS", dataDeleteComments);

  const likeN = data.comments.map(
    (comment: {
      likes: { _id: string; commentId: string; userId: string }[];
    }) => {
      return comment.likes.map(
        (like: { _id: string; commentId: string; userId: string }) => {
          return {
            idLike: like._id,
            commentID: like.commentId,
            user: like.userId
          };
        }
      );
    }
  );
  console.log("LIKE N", likeN);

  const newLikeN = likeN.flat();

  console.log("LIKE N NEW", newLikeN);

  return (
    <div>
      {data.comments.map(
        (
          comment: {
            _id: string;
            postId: string;
            text: string;
            author: string;
            date: string;
          },
          index: any
        ) => (
          <div key={comment._id} /*ref={refs[comment._id]}*/>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Paper className={classes.root1}>
                <Avatar variant="rounded" className={classes.green}>
                  <PersonIcon
                    style={{
                      height: 40,
                      width: 40
                    }}
                  />
                </Avatar>
                <div>
                  <div key={comment._id}>
                    <Typography
                      variant="body1"
                      className={classes.textUser}
                      component="span"
                      style={{ display: "flex" }}
                    >
                      <FetchQueryAuthor userID={comment.author} />
                      <Typography
                        variant="body1"
                        style={{
                          color: "#e65100",
                          fontSize: 18,
                          marginLeft: "0.5rem"
                        }}
                      >
                        says...
                      </Typography>
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      className={classes.textDateCreation}
                    >
                      Created on: {handleDate(comment.date)}
                    </Typography>
                    <Typography
                      key={comment._id}
                      variant="body1"
                      color="textPrimary"
                      className={classes.textComment}
                      style={{ wordWrap: "break-word" }}
                    >
                      {comment.text}
                    </Typography>
                  </div>
                </div>
                <Divider style={{ position: "relative", top: "5.5vh" }} />
                <div
                  style={{
                    position: "relative",
                    top: "2vh",
                    marginTop: "4.4%",
                    marginBottom: "2.2%",
                    padding: "0.2%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "2%"
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        addCommentLike({
                          variables: {
                            data: {
                              _id: mongoID.generate(),
                              commentId: comment._id
                            }
                          }
                        })
                          .catch(error => {
                            console.log("ERROR ADD LIKE", error);
                          })
                          .then(() =>
                            removeCommentLike({
                              variables: {
                                _id: comment._id
                              },
                              refetchQueries: [
                                { query: COMMENTS_QUERY, variables: { postId } }
                              ]
                            }).catch(error => {
                              console.log("ERROR REMOVE COMMENT", error);
                              alert(error);
                            })
                          );
                      }}
                    >
                      <Like
                        color={
                          dataLikeComments[index].isLikedByCurrentUser
                            ? "primary"
                            : "inherit"
                        }
                      />
                    </IconButton>

                    <Typography
                      component={"span"}
                      color="primary"
                      className={classes.numberOfLikes}
                    >
                      <CommentLikeData comment={comment} />
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "5%"
                    }}
                  >
                    {dataDeleteComments[index].possibleDelete ? (
                      <IconButton
                        onClick={() => {
                          removeComment({
                            variables: { _id: comment._id },
                            refetchQueries: [
                              { query: COMMENTS_QUERY, variables: { postId } }
                            ]
                          }).catch(error => {
                            console.log("ERROR REMOVE COMMENT", error);
                            alert(error);
                          });
                        }}
                      >
                        <DeleteIcon
                          color={
                            dataDeleteComments[index].possibleDelete
                              ? "primary"
                              : "inherit"
                          }
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => {
                          alert("You are not allowed to delete this comment!");
                        }}
                      >
                        <DeleteIcon
                          color={
                            dataDeleteComments[index].possibleDelete
                              ? "primary"
                              : "inherit"
                          }
                        />
                      </IconButton>
                    )}

                    <Divider
                      style={{
                        transform: "rotate(90deg)",
                        width: "45%"
                      }}
                    />
                    <IconButton>
                      <ReplyIcon />
                    </IconButton>
                  </div>
                </div>
              </Paper>
            </div>
            <Divider
              variant="fullWidth"
              style={{ marginBottom: "10%", marginTop: "8%" }}
            />
          </div>
        )
      )}
    </div>
  );
};
