import React from "react";
import { ImageCarousel } from "../components/ImageCarousel";
import { Paper } from "@material-ui/core";

export const Home: React.FC = () => {
  return (
    <div
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "85%"
      }}
    >
      <Paper
        style={{
          height: "55vh",
          width: "85vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ImageCarousel />
      </Paper>
    </div>
  );
};
