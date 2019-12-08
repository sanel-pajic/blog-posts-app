import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import imageHorse from "../images/horse.jpg";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { Typography } from "@material-ui/core";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import { blue } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { CircularLoading } from "./CircularLoading";
import { ErrorLoading } from "./ErrorLoading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    control: {
      padding: theme.spacing(2)
    },
    card: {
      height: "auto",
      width: 450,
      marginTop: 50
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: blue[800],
      width: 60,
      height: 60
    }
  })
);

const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description
    }
  }
`;

const REMOVE_MUTATION = gql`
  mutation($_id: ID!) {
    removeBlogPost(_id: $_id) {
      _id
    }
  }
`;

const message = `Truncation should be conditionally applicable on this long line of text
 as this is a much longer line than what the container can support. `;

export const BlogList: React.FC = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { data, loading } = useQuery(BLOGS_QUERY);
  console.log("data TABLE:", data);
  const [removeBlogPost, { error }] = useMutation(REMOVE_MUTATION);
  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    console.log("error", error);
    return <ErrorLoading/>;
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={5}>
          {data.blogPosts
            .reverse()
            .map(
              (blog: {
                _id: string | number | undefined;
                title: string | number | undefined;
                description: string | number | undefined;
              }) => (
                <Grid key={blog._id} item>
                  <Card className={classes.card}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
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
                      image={imageHorse}
                      title="Paella dish"
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
                      >
                        {blog.description} - 
                        {message}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                      <IconButton
                        style={{ marginLeft: "55%" }}
                        onClick={() =>
                          removeBlogPost({
                            variables: { _id: blog._id },
                            refetchQueries: [{ query: BLOGS_QUERY }]
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        className={clsx(classes.expand, {
                          [classes.expandOpen]: expanded
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <Typography paragraph>Method:</Typography>
                        <Typography paragraph>
                          Heat 1/2 cup of the broth in a pot until simmering,
                          add saffron and set aside for 10 minutes.
                        </Typography>
                        <Typography paragraph>
                          Heat oil in a (14- to 16-inch) paella pan or a large,
                          deep skillet over medium-high heat. Add chicken,
                          shrimp and chorizo, and cook, stirring occasionally
                          until lightly browned, 6 to 8 minutes. Transfer shrimp
                          to a large plate and set aside, leaving chicken and
                          chorizo in the pan. Add pimentón, bay leaves, garlic,
                          tomatoes, onion, salt and pepper, and cook, stirring
                          often until thickened and fragrant, about 10 minutes.
                          Add saffron broth and remaining 4 1/2 cups chicken
                          broth; bring to a boil.
                        </Typography>
                        <Typography paragraph>
                          Add rice and stir very gently to distribute. Top with
                          artichokes and peppers, and cook without stirring,
                          until most of the liquid is absorbed, 15 to 18
                          minutes. Reduce heat to medium-low, add reserved
                          shrimp and mussels, tucking them down into the rice,
                          and cook again without stirring, until mussels have
                          opened and rice is just tender, 5 to 7 minutes more.
                          (Discard any mussels that don’t open.)
                        </Typography>
                        <Typography>
                          Set aside off of the heat to let rest for 10 minutes,
                          and then serve.
                        </Typography>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              )
            )}
        </Grid>
      </Grid>
    </Grid>
  );
};
