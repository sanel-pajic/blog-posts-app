import React, { useEffect } from "react";
import {
  Typography,
  Divider,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { CHECK_VALID_TOKEN_RESET_MUTATION } from "../graphql-queries-mutations/mutations";
import Alert from "@material-ui/lab/Alert";
import { RouteComponentProps } from "react-router-dom";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    rootDiv: {
      width: "80%",
      paddingLeft: "10%",
      paddingRight: "5%",
      paddingTop: "2%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100%",
      marginBottom: "12.7%",
    },
    divider: {
      width: "100%",
      marginTop: "1%",
      marginBottom: "1%",
    },
  })
);

export const CheckResetEmailPage: React.FC<RouteComponentProps<{
  token: string;
}>> = ({ match }) => {
  const tokenFromHistory = match.params.token;
  let history = useHistory();

  console.log("TOKEN FROM HISTORY", tokenFromHistory);

  const classes = useStyles();

  const [checkResetTokenMutation, { error }] = useMutation(
    CHECK_VALID_TOKEN_RESET_MUTATION,
    {
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    checkResetTokenMutation({
      variables: {
        resetToken: tokenFromHistory,
      },
    })
      .then((res) => {
        console.log("DATA", res);
        localStorage.setItem("resetToken", res.data.checkEmailResetToken.token);
        history.push("/reset");
      })
      .catch((error) => console.log(error));
  }, [tokenFromHistory, checkResetTokenMutation, history]);

  return (
    <div className={classes.rootDiv}>
      <Typography variant="h5" style={{ marginTop: "1 %" }}>
        Reset Password
      </Typography>
      <Divider className={classes.divider} />
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <Alert color="error" variant="filled">
              {message}
            </Alert>
          </div>
        ))}
    </div>
  );
};
