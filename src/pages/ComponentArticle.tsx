import React, { useState } from "react";
import {
  Paper,
  Button,
  Typography,
  Grid,
  useMediaQuery,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import * as yup from "yup";
import { Redirect } from "react-router";
import { CircularLoading } from "../components/CircularLoading";
import { TableArticles } from "../components/TableArticles";
import { ARTICLES_QUERY } from "../graphql-queries-mutations/queries";
import { ADD_MUTATION_ARTICLE } from "../graphql-queries-mutations/mutations";
import { ModalError } from "../components/ModalError";

let schema = yup.object().shape({
  code: yup.string().required().min(5),
  description: yup.string().required().min(5),
  quantity: yup.number().required().min(1),
  price: yup.number().required().min(1),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "auto",
      marginRight: "auto",
    },
    paperMedia: {
      width: "380px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "auto",
      marginRight: "auto",
    },
    mainDiv: {
      width: "60vw",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: "1%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      position: "relative",
      padding: "1%",
      marginBottom: "4%",
    },
    mainDivMedia: {
      width: "340px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: "1%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      position: "relative",
      padding: "1%",
      marginBottom: "4%",
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
        border: "1px solid gray",
      },
    },
    quantity: {
      width: 80,
    },
    quantityMedia: {
      width: 300,
    },
    code: {
      width: 120,
    },
    codeMedia: {
      width: 300,
    },
    description: {
      width: 300,
    },
    price: {
      width: 60,
    },
    priceMedia: {
      width: 300,
    },
    addButton: {
      width: 170,
      marginLeft: "5%",
    },
    addButtonMedia: {
      width: 170,
      marginTop: 20,
      marginBottom: 20,
    },
    textHeader: {
      marginTop: "2%",
      marginBottom: "1%",
    },
    rootGrid: {
      flexGrow: 2,
    },
    rootDiv: {
      display: "flex",
      justifyContent: "center",
      justifyItems: "center",
      marginTop: "1vh",
    },
    typographyListAll: { marginTop: 30 },
  })
);

export const ComponentArticle: React.FC = () => {
  const classes = useStyles();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const userId = localStorage.getItem("userId");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { data, loading } = useQuery(ARTICLES_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [addComponentArticle, { error }] = useMutation(ADD_MUTATION_ARTICLE, {
    errorPolicy: "all",
  });
  if (error) {
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

  if (!userId) {
    return <Redirect to="/authorize" />;
  }

  return (
    <div className={classes.rootDiv}>
      <Paper className={matches ? classes.paper : classes.paperMedia}>
        <Typography
          variant={matches ? "h4" : "h5"}
          color="inherit"
          className={classes.textHeader}
        >
          Add New Component
        </Typography>
        <Paper className={matches ? classes.mainDiv : classes.mainDivMedia}>
          <div className={classes.rootGrid}>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
            >
              <Grid item xs="auto">
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="filled-basic1"
                    label="Code"
                    variant="filled"
                    size="small"
                    className={matches ? classes.code : classes.codeMedia}
                    color="secondary"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </form>
              </Grid>
              <Grid item xs="auto">
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="filled-basic2"
                    label="Description"
                    variant="filled"
                    size="small"
                    className={classes.description}
                    color="secondary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </form>
              </Grid>
              <Grid item xs="auto">
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="filled-basic3"
                    label="Quantity"
                    variant="filled"
                    size="small"
                    type="number"
                    className={
                      matches ? classes.quantity : classes.quantityMedia
                    }
                    color="secondary"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </form>
              </Grid>
              <Grid item xs="auto">
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="filled-basic4"
                    label={matches ? "Price" : "Price €"}
                    variant="filled"
                    size="small"
                    className={matches ? classes.price : classes.priceMedia}
                    color="secondary"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </form>
              </Grid>
              {matches ? (
                <Grid item xs="auto">
                  <Typography variant="h4">€</Typography>
                </Grid>
              ) : null}

              <Grid item xs="auto">
                <Button
                  variant="contained"
                  color="secondary"
                  className={
                    matches ? classes.addButton : classes.addButtonMedia
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setCode("");
                    setDescription("");
                    setQuantity("");
                    setPrice("");
                    try {
                      const valid = schema.validateSync({
                        code,
                        description,
                        quantity,
                        price,
                      });
                      console.log("VALID", valid);

                      addComponentArticle({
                        variables: {
                          data: {
                            _id: mongoID.generate(),
                            code,
                            description,
                            quantity,
                            price,
                            author: userId,
                          },
                        },
                        refetchQueries: [{ query: ARTICLES_QUERY }],
                      }).catch((error) => alert(error));
                    } catch (error) {
                      alert(error);
                    }
                  }}
                >
                  Add Component
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Typography
          variant={matches ? "h4" : "h5"}
          color="textSecondary"
          className={matches ? undefined : classes.typographyListAll}
        >
          List of all components
        </Typography>
        <TableArticles />
      </Paper>
    </div>
  );
};
