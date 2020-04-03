import React from "react";
import { ImageCarousel } from "../components/ImageCarousel";
import {
  makeStyles,
  Card,
  CardHeader,
  Avatar,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  Button
} from "@material-ui/core";
import { CircularLoading } from "../components/CircularLoading";
import { useQuery } from "@apollo/react-hooks";
import { BLOGS_QUERY } from "../queries/queries";
import Grid from "@material-ui/core/Grid";
import { blue, yellow } from "@material-ui/core/colors";
import { useHistory, Link } from "react-router-dom";
import StarsIcon from "@material-ui/icons/Stars";
import { ColorButtonTeal } from "../components/AddCommentsComponent";

const useStyles = makeStyles(theme => ({
  card: {
    height: "auto",
    width: 450,
    marginTop: "5vh"
  },
  avatar: {
    backgroundColor: blue[800],
    width: 60,
    height: 60
  },
  root: {
    flexGrow: 1
  },
  media: {
    paddingTop: "56.25%"
  },
  star: {
    marginLeft: 10,
    marginRight: 10,
    color: theme.palette.getContrastText(yellow[400]),
    backgroundColor: yellow[300],
    height: 40,
    width: 40,
    borderRadius: 40
  }
}));

export const Home: React.FC = () => {
  let history = useHistory();
  const classes = useStyles();
  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (loading || !data) {
    return <CircularLoading />;
  }

  // console.log("DATA BLOGS FROM HOME", data);

  const dataBlogPostsHome = data.blogPosts.map(
    (blog: {
      likes: string | any[];
      _id: string;
      title: string;
      description_short: string;
      description: string;
      image: string;
    }) => {
      return {
        numLikes: blog.likes.length,
        blogId: blog._id,
        title: blog.title,
        description_short: blog.description_short,
        description: blog.description,
        image: blog.image
      };
    }
  );
  // console.log("DATA BLOG FILTERED", dataBlogPostsHome);

  const likeNumbers = dataBlogPostsHome.map((x: any) => {
    return {
      numLIKES: x.numLikes,
      blogID: x.blogId,
      title: x.title,
      description_short: x.description_short,
      description: x.description,
      image: x.image
    };
  });

  // console.log("LIKES NUMBERS", likeNumbers);

  const threeHighestLike = likeNumbers
    .sort(function(a: number, b: number) {
      if (a < b) {
        return 1;
      } else if (a === b) {
        return 0;
      } else {
        return -1;
      }
    })
    .slice(0, 3);

  // console.log("THREE HIGHEST LIKES", threeHighestLike);

  function handleClick(id: string) {
    history.push(`singleblog/${id}`);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: "2vh",
          marginBottom: "5vh"
        }}
      >
        <div
          style={{
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ImageCarousel />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <StarsIcon className={classes.star} />
          <StarsIcon className={classes.star} />
          <StarsIcon className={classes.star} />
          <Typography
            variant="h3"
            color="initial"
            style={{ marginLeft: 20, marginRight: 20 }}
          >
            FEATURED BLOGS
          </Typography>
          <StarsIcon className={classes.star} />
          <StarsIcon className={classes.star} />
          <StarsIcon className={classes.star} />
        </div>

        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={5}>
              {threeHighestLike.map(
                (blog: {
                  blogID: string;
                  title: string;
                  description_short: string;
                  description: string;
                  image: string;
                  likes: any;
                }) => (
                  <Grid key={blog.blogID} item>
                    <Card className={classes.card}>
                      <CardHeader
                        avatar={
                          <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                          >
                            Blog
                          </Avatar>
                        }
                        title={
                          <Typography variant="h5">
                            Title: {blog.title}
                          </Typography>
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
                        <Button
                          size="large"
                          color="primary"
                          style={{
                            color: "#1565c0",
                            textTransform: "none",
                            fontSize: "20px"
                          }}
                          onClick={() => handleClick(blog.blogID)}
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
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10vh"
        }}
      >
        <Typography
          variant="h2"
          color="initial"
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Expand your knowledge.
        </Typography>
        <Typography
          variant="h2"
          color="initial"
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Expand your mind.
        </Typography>
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <ColorButtonTeal
            style={{
              width: 200,
              height: 50,
              fontSize: 20,
              textTransform: "initial",
              marginTop: "5vh",
              marginBottom: "2vh"
            }}
          >
            Get started
          </ColorButtonTeal>
        </Link>
      </div>
    </div>
  );
};
