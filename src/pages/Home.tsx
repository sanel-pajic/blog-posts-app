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
  Button,
  useTheme,
} from "@material-ui/core";
import { CircularLoading } from "../components/CircularLoading";
import { useQuery } from "@apollo/react-hooks";
import { BLOGS_QUERY } from "../graphql-queries-mutations/queries";
import Grid from "@material-ui/core/Grid";
import { blue, yellow } from "@material-ui/core/colors";
import { useHistory, Link } from "react-router-dom";
import StarsIcon from "@material-ui/icons/Stars";
import { ColorButtonTeal } from "../components/AddCommentsComponent";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "auto",
    minWidth: 300,
    maxWidth: 400,
    marginTop: "5vh",
  },
  avatar: {
    backgroundColor: blue[800],
    width: 60,
    height: 60,
  },
  root: {
    flexGrow: 1,
  },
  media: {
    paddingTop: "56.25%",
  },
  star: {
    marginLeft: 10,
    marginRight: 10,
    color: theme.palette.getContrastText(yellow[400]),
    backgroundColor: yellow[300],
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  starOneLeft: {
    position: "relative",
    left: 15,
    bottom: 1,
    color: theme.palette.getContrastText(yellow[400]),
    backgroundColor: yellow[300],
    height: 30,
    width: 30,
    borderRadius: 30,
  },
  starOneRight: {
    position: "relative",
    right: 15,
    bottom: 1,
    color: theme.palette.getContrastText(yellow[400]),
    backgroundColor: yellow[300],
    height: 30,
    width: 30,
    borderRadius: 30,
  },
  descriptionTypography: {
    marginLeft: 20,
    textDecoration: "underline",
  },
  descriptionShortTypography: { wordWrap: "break-word" },
  buttonContinueReading: {
    color: "#1565c0",
    textTransform: "none",
    fontSize: "20px",
    marginLeft: "5%",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-around",
    width: 390,
  },
  expandMN: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10vh",
  },
  typographyMN: { marginLeft: 20, marginRight: 20 },
  typographyMNMedia: { marginLeft: 5, marginRight: 5 },
  buttonGetStarted: {
    width: 200,
    height: 50,
    fontSize: 20,
    textTransform: "initial",
    marginTop: "5vh",
    marginBottom: "2vh",
  },
  buttonGetStartedMedia: {
    width: 170,
    height: 40,
    fontSize: 17,
    textTransform: "initial",
    marginTop: "5vh",
    marginBottom: "2vh",
  },
  divRoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "2vh",
    marginBottom: "5vh",
  },
  imageCarousel: {
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const Home: React.FC = () => {
  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { data, loading } = useQuery(BLOGS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading || !data) {
    return <CircularLoading />;
  }

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
        image: blog.image,
      };
    }
  );

  const likeNumbers = dataBlogPostsHome.map((x: any) => {
    return {
      numLIKES: x.numLikes,
      blogID: x.blogId,
      title: x.title,
      description_short: x.description_short,
      description: x.description,
      image: x.image,
    };
  });

  const threeHighestLike = likeNumbers
    .sort(function (a: { numLIKES: number }, b: { numLIKES: number }) {
      return a.numLIKES - b.numLIKES;
    })
    .slice(0, 3)
    .reverse();

  function handleClick(id: string) {
    history.push(`singleblog/${id}`);
  }

  return (
    <div>
      <div className={classes.divRoot}>
        <div className={classes.imageCarousel}>
          <ImageCarousel />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {matches ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StarsIcon className={classes.star} />
              <StarsIcon className={classes.star} />
              <StarsIcon className={classes.star} />{" "}
            </div>
          ) : (
            <StarsIcon className={classes.starOneLeft} />
          )}

          <Typography
            variant={matches ? "h3" : "h4"}
            color="initial"
            style={{ marginLeft: 20 }}
          >
            FEATURED
          </Typography>
          <Typography
            variant={matches ? "h3" : "h4"}
            color="initial"
            style={{ marginLeft: 15, marginRight: 20 }}
          >
            BLOGS
          </Typography>
          {matches ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StarsIcon className={classes.star} />
              <StarsIcon className={classes.star} />
              <StarsIcon className={classes.star} />{" "}
            </div>
          ) : (
            <StarsIcon className={classes.starOneRight} />
          )}
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
                          className={classes.descriptionTypography}
                        >
                          Description
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                          className={classes.descriptionShortTypography}
                        >
                          {blog.description_short}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <Button
                          size="large"
                          color="primary"
                          className={classes.buttonContinueReading}
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
      <div className={classes.expandMN}>
        <Typography
          className={matches ? classes.typographyMN : classes.typographyMNMedia}
          variant={matches ? "h2" : "h4"}
          color="initial"
        >
          Expand your knowledge.
        </Typography>
        <Typography
          color="initial"
          className={classes.typographyMN}
          variant={matches ? "h2" : "h4"}
        >
          Expand your mind.
        </Typography>
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <ColorButtonTeal
            className={
              matches ? classes.buttonGetStarted : classes.buttonGetStartedMedia
            }
          >
            Get started
          </ColorButtonTeal>
        </Link>
      </div>
    </div>
  );
};
