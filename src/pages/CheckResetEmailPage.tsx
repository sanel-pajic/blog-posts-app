import React, { useEffect } from "react";
import {
  Typography,
  Divider,
  Theme,
  createStyles,
  makeStyles,
  useTheme,
  useMediaQuery,
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
    dividerMedia: {
      width: "100%",
      marginTop: "3%",
      marginBottom: "5%",
    },
    typographyReset: { marginTop: "1 %" },
    typographyResetMedia: { marginTop: "5%" },
    alert: { display: "flex", justifyContent: "center", alignItems: "center" },
  })
);

export const CheckResetEmailPage: React.FC<RouteComponentProps<{
  token: string;
}>> = ({ match }) => {
  const tokenFromHistory = match.params.token;

  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

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
        localStorage.setItem("resetToken", tokenFromHistory);
        localStorage.setItem("userId", res.data.checkEmailResetToken._id);
        localStorage.setItem(
          "first_name",
          res.data.checkEmailResetToken.first_name
        );
        localStorage.setItem(
          "last_name",
          res.data.checkEmailResetToken.last_name
        );

        history.push("/reset");
      })
      .catch((error) => console.log(error));
  }, [tokenFromHistory, checkResetTokenMutation, history]);

  return (
    <div className={classes.rootDiv}>
      <Typography
        variant="h5"
        className={
          matches ? classes.typographyReset : classes.typographyResetMedia
        }
      >
        Reset Password
      </Typography>
      <Divider className={matches ? classes.divider : classes.dividerMedia} />
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <div key={i}>
            <Alert
              color="error"
              variant="filled"
              className={matches ? undefined : classes.alert}
            >
              {message}
            </Alert>
          </div>
        ))}
    </div>
  );
};
