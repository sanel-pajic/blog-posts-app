import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { CircularLoading } from "../components/CircularLoading";
import { Paper, Typography, CardMedia, Divider } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { RouteComponentProps } from "react-router-dom";
import { CommentComponent } from "../components/CommentComponent";
import { AddCommentsComponent } from "../components/AddCommentsComponent";
import { FetchQueryBlogsAuthor } from "../components/FetchQueryBlogsAuthor";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    media: {
      height: "50vh",
      width: "85vw"
    }
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
    "December"
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
      date
      author
    }
  }
`;

  const classes = useStyles();

  const { data, loading } = useQuery(SINGLE_BLOG_QUERY, {
    fetchPolicy: "cache-and-network"
  });

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
            marginTop: "5%",
            wordWrap: "break-word"
          }}
        >
          {data.blogPost.title}
        </Typography>
        <div
          style={{
            marginLeft: "5rem",
            position: "relative",
            top: "6vh",
            display: "flex"
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
              color: "#ff8a80"
            }}
          >
            {handleDate(data.blogPost.date)}
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontWeight: "bolder",
              marginLeft: "0.5rem",
              color: "#ff8a80"
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
              color: "#ff8a80"
            }}
          >
            <FetchQueryBlogsAuthor userID={data.blogPost.author} />
          </Typography>
        </div>
        <Typography
          color="primary"
          variant="h6"
          style={{
            paddingTop: "3.5rem",
            paddingLeft: "3rem",
            marginTop: "0.5%",
            marginBottom: "0.5%"
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
            paddingRight: "3rem"
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
            padding: "3rem",
            wordWrap: "break-word"
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
