import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import { Typography } from "@material-ui/core";

export const ErrorLoading: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
        marginBottom: 150
      }}
    >
      <ErrorIcon
        style={{ width: 100, height: 100 }}
        color="error"
        fontSize="large"
      />

      <Typography color="textSecondary" variant="h3" style={{ marginTop: 20 }}>
        Error Loading !!!
      </Typography>
      <Typography color="textSecondary" variant="h3" style={{ marginTop: 20 }}>
        To continue, try to reload.
      </Typography>
    </div>
  );
};
