import React from "react";
import { Paper } from "@material-ui/core";

export const About: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        justifyItems: "center", 
        marginTop:"1vh"
      }}
    >
      <Paper
        style={{
          width: "70vw",
          height: "60vh"
        }}
      >ABOUT COMPONENT</Paper>
    </div>
  );
};
