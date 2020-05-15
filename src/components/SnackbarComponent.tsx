import React from "react";
import clsx from "clsx";
import InfoIcon from "@material-ui/icons/Info";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { lightBlue, green } from "@material-ui/core/colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useMediaQuery } from "@material-ui/core";

const variantIcon = {
  info: InfoIcon,
  success: CheckCircleIcon,
};

const useStyles = makeStyles((theme: Theme) => ({
  info: {
    backgroundColor: lightBlue[400],
  },
  success: {
    backgroundColor: green[500],
  },
  icon: {
    fontSize: 35,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
  },
  snackbarDiv: {
    width: "62vw",
    minWidth: 500,
    marginBottom: "2vh",
  },
  snackbarDivMedia: { width: 350, marginBottom: "3vh", marginTop: "2vh" },
}));

export interface Props {
  className?: string;
  message?: string;
  variant: keyof typeof variantIcon;
}

function MySnackbarContentWrapper(props: Props) {
  const classes = useStyles();
  const { className, message, variant } = props;
  const Icon = variantIcon[variant];
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div className={matches ? classes.snackbarDiv : classes.snackbarDivMedia}>
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
      />
    </div>
  );
}
type PropsMessage = {
  message: string;
};

function checkMessage(message: string) {
  if (message === "Unauthorized! - Please Sign In") {
    return <MySnackbarContentWrapper variant="info" message={message} />;
  } else if (message === "Authorized") {
    return <MySnackbarContentWrapper variant="success" message={message} />;
  }
}

export const SnackbarComponent: React.FC<PropsMessage> = ({ message }) => {
  return <div>{checkMessage(message)}</div>;
};
