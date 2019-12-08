import React from "react";
import { Link } from "react-router-dom";
import logoError from "../images/error.png";
import Button from "@material-ui/core/Button";

export const Error: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      <img src={logoError} alt="Error Logo" style={{ marginTop: 5 }} />

      <Link to="/">
        <Button
          variant="outlined"
          color="default"
          style={{ position: "relative", bottom: 75 }}
        >
          Back to home
        </Button>
      </Link>
    </div>
  );
};
