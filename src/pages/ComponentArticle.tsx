import React, { useState } from "react";
import { Paper, Button, Typography, Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";
import * as yup from "yup";
import { useProtectedPath } from "../components/useProtectedPath";
import { Redirect } from "react-router";
import { CircularLoading } from "../components/CircularLoading";
import { ErrorLoading } from "../components/ErrorLoading";

let schema = yup.object().shape({
  code: yup
    .string()
    .required()
    .min(5),
  description: yup
    .string()
    .required()
    .min(5),
  quantity: yup
    .number()
    .required()
    .min(1),
  price: yup
    .number()
    .required()
    .min(1)
});

const ARTICLES_QUERY = gql`
  query {
    componentArticles {
      _id
      code
      description
      quantity
      price
    }
  }
`;

const ADD_MUTATION_ARTICLE = gql`
  mutation($data: ComponentArticleInput!) {
    addComponentArticle(data: $data)
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
      height: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "auto",
      marginRight: "auto"
    },
    mainDiv: {
      width: "60vw",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: "1%",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      position: "relative",
      bottom: "23%",
      padding: "1%"
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
        border: "1px solid gray"
      }
    },
    quantity: {
      width: 80
    },
    code: {
      width: 120
    },
    description: {
      width: 300
    },
    price: {
      width: 60
    },
    addButton: {
      width: 170,
      marginLeft: "5%"
    },
    textHeader: {
      position: "relative",
      bottom: "23%"
    },
    rootGrid: {
      flexGrow: 2
    }
  })
);

export const ComponentArticle: React.FC = () => {
  const classes = useStyles();
  const accessGrant = useProtectedPath();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const { data, loading } = useQuery(ARTICLES_QUERY);

  const [addComponentArticle, { error }] = useMutation(ADD_MUTATION_ARTICLE);
  if (error) {
    console.log("error", error);

    return <ErrorLoading />;
  }

  if (loading || !data) {
    return <CircularLoading />;
  }

  if (!accessGrant) {
    return <Redirect to="/authorize" />;
  }

  console.log("ACCESS GRANT", accessGrant);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        justifyItems: "center",
        marginTop: "1vh"
      }}
    >
      <Paper className={classes.paper}>
        <Typography
          variant="h4"
          color="textSecondary"
          className={classes.textHeader}
        >
          Add New Component
        </Typography>
        <Paper className={classes.mainDiv}>
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
                    className={classes.code}
                    color="secondary"
                    value={code}
                    onChange={e => setCode(e.target.value)}
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
                    onChange={e => setDescription(e.target.value)}
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
                    className={classes.quantity}
                    color="secondary"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                  />
                </form>
              </Grid>
              <Grid item xs="auto">
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    id="filled-basic4"
                    label="Price"
                    variant="filled"
                    size="small"
                    className={classes.price}
                    color="secondary"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </form>
              </Grid>
              <Grid item xs="auto">
                <Typography variant="h4">€</Typography>
              </Grid>
              <Grid item xs="auto">
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.addButton}
                  onClick={e => {
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
                        price
                      });
                      console.log("VALID", valid);

                      addComponentArticle({
                        variables: {
                          data: {
                            _id: mongoID.generate(),
                            code,
                            description,
                            quantity,
                            price
                          }
                        },
                        refetchQueries: [{ query: ARTICLES_QUERY }]
                      });
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
      </Paper>
    </div>
  );
};
