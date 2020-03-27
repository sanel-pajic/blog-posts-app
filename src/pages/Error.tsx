import React from "react";
import { Link } from "react-router-dom";
import logoError from "../images/error.png";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";

export const Error: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          width: "40%",
          height: "50vh", 
          padding: "5%", 
          marginTop:"1%"
        }}
      >
        <img src={logoError} alt="Error Logo" style={{ marginTop: "3vh" }} />

        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            color="default"
            style={{ position: "relative", bottom: "5vh" }}
          >
            Back to home
          </Button>
        </Link>
      </Paper>
    </div>
  );
};
