import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Typography, Button, useMediaQuery } from "@material-ui/core";
import messageError from "../images/errorMessage.png";

function rand() {
  return Math.round(Math.random() * 2) - 1;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 600,
      height: 340,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    paperMedia: {
      position: "absolute",
      width: 300,
      height: 340,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    rootDiv: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    imageError: {
      marginTop: "5%",
      width: 220,
      height: 170,
      opacity: 0.7,
      marginBottom: "5%",
    },
    typographyMessage: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "5%",
      textAlign: "center",
    },
  })
);

export const ModalError: React.FC<{ message: string }> = ({ message }) => {
  const classes = useStyles();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [modalStyle] = React.useState(getModalStyle);
  const [open] = React.useState(true);

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
      >
        <div
          style={modalStyle}
          className={matches ? classes.paper : classes.paperMedia}
        >
          <div className={classes.rootDiv}>
            <img
              src={messageError}
              alt="Error Message"
              className={classes.imageError}
            />
            <Typography
              id="simple-modal-title"
              className={classes.typographyMessage}
              color="error"
              variant="h4"
            >
              {message}
            </Typography>
            <Button
              variant="outlined"
              color="default"
              style={{ color: "black" }}
              onClick={() => window.location.reload()}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
