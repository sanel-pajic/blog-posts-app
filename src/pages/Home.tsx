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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3.5vh",
          marginBottom: "15%"
        }}
      >
        <Paper
          style={{
            height: "45vh",
            width: "50vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
          }}
        >
          <ImageCarousel />
        </Paper>
      </div>
    </div>
  );
};
