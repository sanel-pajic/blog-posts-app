import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  divRoot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

type Props = {
  comment: { [key: string]: any };
};

export const CommentLikeData: React.FC<Props> = ({ comment }) => {
  const classes = useStyles();
  return (
    <div className={classes.divRoot}>
      <div>{comment.likes.length}</div>
    </div>
  );
};
