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
        overflow:"hidden"
      }}
    >
      <img src={logoError} alt="Error Logo" />

      <Link to="/">
        <Button
          variant="outlined"
          color="primary"
          style={{ position: "relative", bottom: 70 }}
        >
          Home
        </Button>
      </Link>
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width:"100%",
          height:"15%",
          background: "linear-gradient(60deg,#29323c 0%,#485563 100%)",
          color:"white",
          textAlign:"center"
        }}
      >
     <p style= {{marginTop:"4%"}}>Created by Sanel Pajic</p>
      </div>
    </div>
  );
};
