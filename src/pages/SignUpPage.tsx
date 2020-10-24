import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  useMediaQuery,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import mongoID from "bson-objectid";
import { useMutation } from "@apollo/react-hooks";
import * as yup from "yup";
import { ADD_MUTATION_USER } from "../graphql-queries-mutations/mutations";
import { useHistory } from "react-router-dom";
import { store } from "../components/store";

let schema = yup.object().shape({
  first_name: yup.string().required("Please enter First Name.").min(3,"Must be at least 3 characters."),
  last_name: yup.string().required("Please enter Last Name.").min(3,"Must be at least 3 characters."),
  email: yup.string().required("Please Enter your Email.").min(5,"Must be at least 5 characters.").email("Must be Email."),
  password: yup.string().required("Password is required!").min(5,"Must be at least 5 characters."),
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: "auto",
    marginRight: "auto",
    width: "35%",
    marginTop: "2%",
    marginBottom: "4.7%",
    paddingBottom: "4%",
  },
  rootMedia: { marginTop: "2%", marginBottom: "4.7%" },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  avatarMedia: {
    marginTop: 20,
    backgroundColor: "#f50057",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#1976d2",
  },
  typographyCopyright: {
    position: "relative",
    top: 30,
  },
  typographyCopyrightMedia: { padding: 20 },
}));

export const ValidationTextField = withStyles({
  root: {
    "& input:valid + fieldset": {
      borderColor: "green",
      borderWidth: 2,
    },
    "& input:invalid + fieldset": {
      borderColor: "#bdbdbd",
      borderWidth: 1,
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 6,
      padding: "4px !important", // override inline-style
    },
  },
})(TextField);

export const SignUpPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  function Copyright() {
    return (
      <div>
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
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          className={
            matches
              ? classes.typographyCopyright
              : classes.typographyCopyrightMedia
          }
        >
          <Link color="primary" href="/">
            Go Back
          </Link>
        </Typography>
      </div>
    );
  }

  const [addUser, { error }] = useMutation(ADD_MUTATION_USER);

  if (error) {
    alert(error);
  }

  return (
    <Paper className={matches ? classes.root : classes.rootMedia}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={matches ? classes.avatar : classes.avatarMedia}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ValidationTextField
                  autoComplete="firstName"
                  name="firstName"
                  label="First Name"
                  required
                  variant="outlined"
                  id="firstName"
                  fullWidth
                  autoFocus
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ValidationTextField
                  autoComplete="lastName"
                  name="lastName"
                  label="Last Name"
                  required
                  variant="outlined"
                  id="lastName"
                  fullWidth
                  autoFocus
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidationTextField
                  autoComplete="email"
                  name="email"
                  label="Email Address"
                  required
                  variant="outlined"
                  id="email"
                  fullWidth
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidationTextField
                  autoComplete="current-password"
                  name="password"
                  label="Password"
                  required
                  type="password"
                  variant="outlined"
                  id="password"
                  fullWidth
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e) => {
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
                    password,
                  });
                  console.log("VALID", valid);
                  addUser({
                    variables: {
                      data: {
                        _id: mongoID.generate(),
                        first_name,
                        last_name,
                        email,
                        password,
                      },
                    },
                  })
                    .then((res) => {
                      localStorage.setItem("token", res.data.addUser.token);
                      localStorage.setItem("userId", res.data.addUser.userId);
                      history.push("/authorize");
                      store.setState({
                        authorized: true,
                      });
                    })
                    .catch((error) => {
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
