import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Paper } from "@material-ui/core";
import mongoID from "bson-objectid";
import { useMutation, useQuery } from "@apollo/react-hooks";
import * as yup from "yup";
import { ADD_MUTATION_USER } from "../queries/mutations";
import { useHistory } from "react-router-dom";
import { store } from "../components/store";
import { CircularLoading } from "../components/CircularLoading";
import { USERS_QUERY } from "../queries/queries";
import * as R from "ramda";

let schema = yup.object().shape({
  first_name: yup
    .string()
    .required()
    .min(3),
  last_name: yup
    .string()
    .required()
    .min(3),
  email: yup
    .string()
    .required()
    .min(5)
    .email(),
  password: yup
    .string()
    .required()
    .min(5)
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        color="primary"
        href="https://react-beach-resort-sanel-recording.netlify.com/"
      >
        Sanel Pajic
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: "auto",
    marginRight: "auto",
    width: "35%",
    marginTop: "2%",
    marginBottom: "4.7%",
    paddingBottom: "4%"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export const SignUpPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const [addUser, { error }] = useMutation(ADD_MUTATION_USER, {
    update: (cache, { data }) => {
      const previousData: any = cache.readQuery({
        query: USERS_QUERY
      });

      console.log("DATA USERS", data, "PREVIOUS DATA USERS", previousData);

      cache.writeQuery({
        query: USERS_QUERY,
        data: R.over(R.lensProp("users"), R.append(data.addUser), previousData)
      });
    }
  });

  if (loading || !data) {
    return <CircularLoading />;
  }

  if (error) {
    console.log("error", error);
  }

  console.log("DATA USERS", data);

  return (
    <Paper className={classes.root}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="firstName"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={first_name}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  value={last_name}
                  onChange={e => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => {
                e.preventDefault();
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                try {
                  const valid = schema.validateSync({
                    first_name,
                    last_name,
                    email,
                    password
                  });
                  console.log("VALID", valid);

                  addUser({
                    variables: {
                      data: {
                        _id: mongoID.generate(),
                        first_name,
                        last_name,
                        email,
                        password
                      }
                    }
                  })
                    .then(res => {
                      console.log("DATA", res);
                      localStorage.setItem("token", res.data.token);
                      history.push("/authorize");
                      store.setState({
                        authorized: true,
                        token: res.data.token,
                        userId: res.data.userId,
                        tokenExpiration: res.data.tokenExpiration
                      });
                      console.log("STORE DATA", store);
                    })
                    .catch(error => {
                      alert(error);
                      history.push("/signup");
                    });
                } catch (error) {
                  alert(error);
                }
              }}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/authorize" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </Paper>
  );
};
