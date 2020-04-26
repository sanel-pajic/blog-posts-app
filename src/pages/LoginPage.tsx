import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_MUTATION } from "../graphql-queries-mutations/mutations";
import { useHistory } from "react-router-dom";
import { store } from "../components/store";
import { ValidationTextField } from "./SignUpPage";

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
        style={{ position: "relative", top: 30 }}
      >
        <Link color="primary" href="/">
          Go Back
        </Link>
      </Typography>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "45vh",
    width: "100%",
    marginTop: "1%",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    padding: "10%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    margin: "2%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
    width: "68%",
  },
}));

export const LoginPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { error }] = useMutation(LOGIN_MUTATION);

  if (error) {
    console.log("error", error);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: "40vh",
        marginTop: "1%",
        width: 1000,
        minWidth: 500,
      }}
    >
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <ValidationTextField
                autoComplete="email"
                margin="normal"
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
              <ValidationTextField
                autoComplete="current-password"
                margin="normal"
                name="password"
                label="Password"
                type="password"
                required
                variant="outlined"
                id="password"
                fullWidth
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                  onClick={(e) => {
                    e.preventDefault();
                    setEmail("");
                    setPassword("");
                    login({
                      variables: {
                        email: email,
                        password: password,
                      },
                    })
                      .then((res) => {
                        console.log("DATA", res);
                        localStorage.setItem("token", res.data.login.token);
                        history.push("/authorize");
                        store.setState({
                          authorized: true,
                          token: res.data.login.token,
                          userId: res.data.login.userId,
                          tokenExpiration: res.data.login.tokenExpiration,
                        });
                        console.log("STORE DATA", store);
                      })
                      .catch((error) => {
                        console.log("ERROR", error);
                        alert(error);
                      })
                      .finally(() => window.location.reload());
                  }}
                >
                  Sign In - PRESS TO LOGIN
                </Button>
              </div>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgot" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
