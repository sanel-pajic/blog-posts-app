import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles
} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Typography, Button, Paper } from "@material-ui/core";
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
    transform: `translate(-${top}%, -${left}%)`
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
      padding: theme.spacing(2, 4, 3)
    },
    btnAdd: {
      margin: theme.spacing(1),
      width: 150
    },
    btnShow: {
      margin: theme.spacing(1),
      width: 180
    }
  })
);

const ColorButtonAdd = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: green[500]
  }
}))(Button);

const ColorButtonShow = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: deepOrange[500]
  }
}))(Button);

export const DialogVisibleModal: React.FC<{
  dialogVisible: boolean;
  message: string;
  blogID: string;
}> = ({ dialogVisible, message, blogID }) => {
  let history = useHistory();
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);

  const handleClickShowBlog = (id: string) => {
    history.push(`singleblog/${id}`);
  };
  //console.log("BLOG ID", blogID);
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={dialogVisible}
      >
        <div style={modalStyle} className={classes.paper}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20
            }}
          >
            <Paper
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: 350,
                height: 300,
                boxShadow:
                  "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
              }}
            >
              {" "}
              <CheckCircleRoundedIcon
                style={{ color: green[500], width: 100, height: 100 }}
              />
              <Typography
                id="simple-modal-title"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "5%",
                  marginBottom: "5%"
                }}
                color="textSecondary"
                variant="h5"
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
