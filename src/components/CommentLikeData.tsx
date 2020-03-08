import React from "react";

type Props = {
  comment: { [key: string]: any };
};

export const CommentLikeData: React.FC<Props> = ({ comment }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div>{comment.likes.length}</div>
    </div>
  );
};
