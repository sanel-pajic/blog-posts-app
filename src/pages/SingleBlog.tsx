import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { CircularLoading } from "../components/CircularLoading";
import { Paper, Typography, CardMedia, Divider } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { Comments } from "../components/Comments";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: "45vh",
      width: "90vw"
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
        marginTop: "4%"
      }}
    >
      <Paper
        style={{
          width: "40vw"
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
            padding: "2rem",
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
            padding: 30
          }}
        >
          <CardMedia
            title="Blog Post Image"
            className={classes.media}
            image={data.blogPost.image}
          />
        </div>
        <Typography
          color="textPrimary"
          variant="h5"
          style={{
            padding: "20px"
          }}
          dangerouslySetInnerHTML={{ __html: data.blogPost.description }}
        ></Typography>
        <Divider variant="middle" style={{}} />
        <Comments />
      </Paper>
    </div>
  );
};
