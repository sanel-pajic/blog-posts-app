import React from "react";
import { Button, Typography } from "@material-ui/core";

require("dotenv").config();

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

type Props = {
  onUploadSuccess: (image: string) => void;
};

export const CloudinaryWidget: React.FC<Props> = ({ onUploadSuccess }) => {
  // @ts-ignore
  const widget = cloudinary.createUploadWidget(
    {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET
    },
    (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        const dataURL: string = result.info.url;
        onUploadSuccess(dataURL);
      }
    }
  );

  const showWidget = () => {
    widget.open();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Typography variant="h6" style={{ marginBottom: "4%" }}>
        Here you can upload a image for your blog.
      </Typography>
      <Button
        onClick={showWidget}
        variant="outlined"
        color="default"
        size="large"
      >
        Upload Photo
      </Button>
    </div>
  );
};
