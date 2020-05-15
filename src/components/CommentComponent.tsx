import React, { useState } from "react";
import {
  Paper,
  createStyles,
  makeStyles,
  Theme,
  IconButton,
  Avatar,
  Typography,
  Divider,
  TextField,
  useTheme,
  useMediaQuery,
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
  REMOVE_COMMENT_LIKE,
  UPDATE_COMMENT,
} from "../graphql-queries-mutations/mutations";
import mongoID from "bson-objectid";
import { FetchQueryAuthor } from "./FetchQueryAuthor";
import { CommentLikeData } from "./CommentLikeData";
import { COMMENTS_QUERY } from "../graphql-queries-mutations/queries";
import * as R from "ramda";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root1: {
      padding: "0.4%",
      width: "86%",
      maxWidth: 500,
      minWidth: 300,
      marginTop: "1%",
      marginBottom: "5%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    },
    green: {
      color: "#fff",
      backgroundColor: green[500],
      height: 45,
      width: 45,
      marginTop: "1rem",
      marginLeft: "1rem",
    },
    textUser: {
      color: "#e65100",
      fontSize: 18,
      marginBottom: "-0.4rem",
      position: "relative",
      left: "4.5rem",
      bottom: "2.7rem",
      width: "fit-content",
    },
    textDateCreation: {
      position: "relative",
      left: "4.5rem",
      bottom: "2.7rem",
    },
    numberOfLikes: {
      fontSize: 20,
      marginLeft: "0.8rem",
      fontWeight: "bold",
    },
    textComment: {
      marginLeft: "1rem",
      marginRight: "0.6rem",
      paddingLeft: "0.2rem",
    },
    divRoot: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    typographyAuthor: { color: "#e65100", fontSize: 18, marginLeft: "0.5rem" },
    personIcon: { height: 40, width: 40 },
    removeIcon: {
      position: "relative",
      left: 380,
      top: 5,
      width: 50,
      height: 50,
    },
    removeIconMedia: {
      position: "relative",
      left: 180,
      top: 10,
      width: 50,
      height: 50,
    },
    commentLike: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
    commentFooter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    divPossibleDeleteEdit: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
    dividerRoot: { marginBottom: 50, marginTop: 40 },
    dividerRootMedia: {
      marginBottom: 50,
      marginTop: 40,
      width: 550,
      position: "relative",
      right: 120,
    },
    dividerComment: { transform: "rotate(90deg)", width: 40 },
    dividerCommentMedia: {
      transform: "rotate(90deg)",
      width: 40,
      position: "relative",
      left: 15,
    },
    editIconMedia: { position: "relative", left: 25 },
    checkIconMedia: { position: "relative", left: 25 },
    divRootMedia: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: "50%",
    },
    editedCommentText: {
      width: 500,
    },
    editedCommentTextMedia: {
      width: 300,
      wordWrap: "break-word",
      textAlign: "justify",
    },
  })
);

export const CommentComponent: React.FC<{
  postId: string;
}> = ({ postId }) => {
  const classes = useStyles();
  const currentUser: string | null = localStorage.getItem("userId");
  const [editingID, setEditingID] = useState<null | string>(null);
  const [editedText, setEditedText] = useState("");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { data, loading } = useQuery(COMMENTS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { postId },
  });
  const [removeComment, { error: errorRemoveComment }] = useMutation(
    REMOVE_COMMENT_MUTATION,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: COMMENTS_QUERY,
          variables: { postId },
        });

        console.log(
          "DATA QUERY REMOVE COMMENT",
          data,
          "PREVIOUS QUERY REMOVE COMMENT",
          previousData
        );
      },
    }
  );
  const [addCommentLike, { error }] = useMutation(ADD_COMMENT_LIKE, {
    update: (cache, { data }) => {
      const previousData: any = cache.readQuery({
        query: COMMENTS_QUERY,
        variables: { postId },
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
        ),
      });
    },
  });
  const [removeCommentLike, { error: errorRemoveCommentLike }] = useMutation(
    REMOVE_COMMENT_LIKE,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: COMMENTS_QUERY,
          variables: { postId },
        });

        console.log(
          "DATA QUERY REMOVE COMMENT LIKE",
          data,
          "PREVIOUS QUERY REMOVE COMMENT LIKE",
          previousData
        );
      },
    }
  );

  const [editComment, { error: errorEditComment }] = useMutation(
    UPDATE_COMMENT,
    {
      update: (cache, { data }) => {
        const previousData: any = cache.readQuery({
          query: COMMENTS_QUERY,
          variables: { postId },
        });

        console.log(
          "DATA QUERY EDIT COMMENT",
          data,
          "PREVIOUS DATA QUERY EDIT COMMENT",
          previousData
        );
        const commentIdx: any = previousData.comments.findIndex(
          (comment: { _id: any }) => {
            return comment._id === data.updateComment.commentId;
          }
        );

        cache.writeQuery({
          query: COMMENTS_QUERY,
          variables: { postId },
          data: R.over(
            R.lensProp("comments"),
            R.over(
              R.lensIndex(commentIdx),
              R.set(R.lensProp("text"), data.updateComment.text)
            ),
            previousData
          ),
        });
      },
    }
  );

  if (error) {
    console.log("error", error);
  }

  if (errorRemoveComment) {
    console.log("error", errorRemoveComment);
  }

  if (errorRemoveCommentLike) {
    console.log("error", errorRemoveCommentLike);
  }

  if (errorEditComment) {
    console.log("error", errorEditComment);
  }
  if (loading || !data) {
    return <CircularLoading />;
  }

  //@ts-ignore
  const dataLikeComments = data.comments.map((comment: any) => {
    const like = comment.likes.find(
      (like: { userId: string }) => like.userId === currentUser
    );
    return {
      numLikes: comment.likes.length,
      isLikedByCurrentUser: like != null,
      commentId: comment._id,
      userLikeID: like ? like._id : null,
    };
  });

  const possibleDeleteEditComments = data.comments.map((comment: any) => {
    return {
      user: comment.author,
      possibleDeleteEdit: comment.author === currentUser,
    };
  });

  const handleEditingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEditedText(value);
  };

  return (
    <div className={matches ? undefined : classes.divRootMedia}>
      {data.comments.map(
        (
          comment: {
            _id: string;
            postId: string;
            text: string;
            author: string;
            date: string;
            likes: { _id: string; commentId: string; userId: string }[];
          },
          index: any
        ) => (
          <div key={comment._id} id={comment._id}>
            <div className={classes.divRoot}>
              <Paper className={classes.root1}>
                <div style={{ display: "flex" }}>
                  <Avatar variant="rounded" className={classes.green}>
                    <PersonIcon className={classes.personIcon} />
                  </Avatar>
                  {possibleDeleteEditComments[index].possibleDeleteEdit ? (
                    <IconButton
                      className={
                        matches ? classes.removeIcon : classes.removeIconMedia
                      }
                      onClick={() => {
                        removeComment({
                          variables: { _id: comment._id },
                          refetchQueries: [
                            { query: COMMENTS_QUERY, variables: { postId } },
                          ],
                        }).catch((error) => {
                          console.log("error", error);
                          alert(error);
                        });
                      }}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  ) : null}
                </div>

                <div className="commentText-div">
                  <div key={comment._id}>
                    <Typography
                      variant="body1"
                      className={classes.textUser}
                      component="span"
                      style={{ display: "flex" }}
                    >
                      <FetchQueryAuthor userID={comment.author} />
                      <Typography
                        className={classes.typographyAuthor}
                        variant="body1"
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
                    {editingID !== comment._id ? (
                      <Typography
                        key={comment._id}
                        variant="body1"
                        color="textPrimary"
                        className={classes.textComment}
                        style={{ wordWrap: "break-word" }}
                      >
                        {comment.text}
                      </Typography>
                    ) : (
                      <TextField
                        multiline={true}
                        variant="outlined"
                        className={
                          matches
                            ? classes.editedCommentText
                            : classes.editedCommentTextMedia
                        }
                        value={editedText}
                        onChange={handleEditingChange}
                      />
                    )}
                  </div>
                </div>
                <Divider style={{ marginTop: 32 }} />
                <div className={classes.commentFooter}>
                  <div className={classes.commentLike}>
                    <IconButton
                      onClick={() => {
                        dataLikeComments[index].isLikedByCurrentUser
                          ? removeCommentLike({
                              variables: {
                                _id: dataLikeComments[index].userLikeID,
                              },
                              refetchQueries: [
                                {
                                  query: COMMENTS_QUERY,
                                  variables: { postId },
                                },
                              ],
                            }).catch((error) => {
                              console.log("ERROR REMOVE COMMENT", error);
                              alert(error);
                            })
                          : addCommentLike({
                              variables: {
                                data: {
                                  _id: mongoID.generate(),
                                  commentId: comment._id,
                                },
                              },
                            }).catch((error) => {
                              console.log("ERROR ADD LIKE", error);
                              alert(error);
                            });
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
                  <div className={classes.divPossibleDeleteEdit}>
                    <div style={{ width: 48, height: 48 }}>
                      {possibleDeleteEditComments[index].possibleDeleteEdit ? (
                        <IconButton>
                          {editingID === comment._id ? (
                            <div>
                              <CheckIcon
                                className={
                                  matches ? undefined : classes.checkIconMedia
                                }
                                color="primary"
                                onClick={() => {
                                  editComment({
                                    variables: {
                                      data: {
                                        _id: comment._id,
                                        text: editedText,
                                      },
                                    },
                                  }).catch((error) =>
                                    console.log("error", error)
                                  );
                                  setEditingID(null);
                                }}
                              />
                            </div>
                          ) : (
                            <div>
                              <EditIcon
                                className={
                                  matches ? undefined : classes.editIconMedia
                                }
                                onClick={() => {
                                  setEditingID(comment._id);
                                  setEditedText(comment.text);
                                }}
                                color="primary"
                              />
                            </div>
                          )}
                        </IconButton>
                      ) : null}
                    </div>
                    <Divider
                      className={
                        matches
                          ? classes.dividerComment
                          : classes.dividerCommentMedia
                      }
                    />
                    <IconButton>
                      <ReplyIcon />
                    </IconButton>
                  </div>
                </div>
              </Paper>
            </div>
            <Divider
              className={
                matches ? classes.dividerRoot : classes.dividerRootMedia
              }
              variant={matches ? "fullWidth" : undefined}
            />
          </div>
        )
      )}
    </div>
  );
};
