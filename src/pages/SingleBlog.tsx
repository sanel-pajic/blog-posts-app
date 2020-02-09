import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { CircularLoading } from "../components/CircularLoading";
import { Paper, Typography, CardMedia, Divider } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { CommentComponent } from "../components/CommentComponent";
import { AddCommentsComponent } from "../components/AddCommentsComponent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: "50vh",
      width: "85vw"
    }
  })
);

export const SingleBlog: React.FC<RouteComponentProps<{ id: string }>> = ({
  match
}) => {
  const idFromHistory = match.params.id;

  const SINGLE_BLOG_QUERY = gql`
  query {
    blogPost(id: "${idFromHistory}") {
      _id
      title
      description
      description_short
      image
    }
  }
`;

  const classes = useStyles();
  const { data, loading } = useQuery(SINGLE_BLOG_QUERY);

  if (loading || !data) {
    return null || <CircularLoading />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        marginBottom: "2%"
      }}
    >
      <Paper
        style={{
          width: "50vw"
        }}
      >
        <Typography
          color="textPrimary"
          variant="h3"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%"
          }}
        >
          {data.blogPost.title}
        </Typography>
        <Typography
          color="textSecondary"
          variant="h5"
          style={{
            padding: "3rem",
            marginTop: "1%"
          }}
        >
          {data.blogPost.description_short}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem"
          }}
        >
          <CardMedia
            image={data.blogPost.image}
            src="Image"
            title="Blog Post Image"
            className={classes.media}
            style={{ width: "90%", marginBottom: "1rem", marginTop: "1rem" }}
          />
        </div>
        <Typography
          color="textPrimary"
          variant="h5"
          style={{
            padding: "3rem"
          }}
          dangerouslySetInnerHTML={{ __html: data.blogPost.description }}
        ></Typography>
        <Divider variant="fullWidth" style={{ marginBottom: "5%" }} />
        <AddCommentsComponent postId={idFromHistory} />
        <CommentComponent postId={idFromHistory} />
      </Paper>
    </div>
  );
};
