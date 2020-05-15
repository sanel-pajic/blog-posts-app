import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
  useTheme,
} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Typography, Button, Paper, useMediaQuery } from "@material-ui/core";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { green, deepOrange } from "@material-ui/core/colors";
import { useHistory } from "react-router-dom";

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
      width: 800,
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
    btnAdd: {
      margin: theme.spacing(1),
      width: 150,
    },
    btnShow: {
      margin: theme.spacing(1),
      width: 180,
    },
    divRoot: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    paperRoot: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: 350,
      height: 300,
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    },
    checkCircleIcon: { color: green[500], width: 100, height: 100 },
    checkCircleIconMedia: { color: green[500], width: 80, height: 80 },
    typographyMessage: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "5%",
      marginBottom: "5%",
    },
  })
);

const ColorButtonAdd = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: green[500],
  },
}))(Button);

const ColorButtonShow = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: deepOrange[500],
  },
}))(Button);

export const DialogVisibleModal: React.FC<{
  dialogVisible: boolean;
  message: string;
  blogID: string;
}> = ({ dialogVisible, message, blogID }) => {
  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [modalStyle] = React.useState(getModalStyle);

  const handleClickShowBlog = (id: string) => {
    history.push(`singleblog/${id}`);
  };
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={dialogVisible}
      >
        <div
          style={modalStyle}
          className={matches ? classes.paper : classes.paperMedia}
        >
          <div className={classes.divRoot}>
            <Paper className={classes.paperRoot}>
              <CheckCircleRoundedIcon
                className={
                  matches
                    ? classes.checkCircleIcon
                    : classes.checkCircleIconMedia
                }
              />
              <Typography
                id="simple-modal-title"
                className={classes.typographyMessage}
                color="textSecondary"
                variant={matches ? "h5" : "h6"}
              >
                {message}
              </Typography>
              <ColorButtonAdd
                variant="contained"
                color="primary"
                className={classes.btnAdd}
                onClick={() => window.location.reload()}
              >
                Add New Blog
              </ColorButtonAdd>
              <ColorButtonShow
                variant="contained"
                color="primary"
                className={classes.btnShow}
                onClick={() => handleClickShowBlog(blogID)}
              >
                Show Added Blog
              </ColorButtonShow>
            </Paper>
          </div>
        </div>
      </Modal>
    </div>
  );
};
