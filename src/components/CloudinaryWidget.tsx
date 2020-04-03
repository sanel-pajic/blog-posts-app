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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 40
        }}
      >
        <img
          src="https://res.cloudinary.com/dz2f3jhr6/image/upload/v1576156104/samples/cloudinary-icon.png"
          alt="img-widget"
          style={{ width: 70, height: 50, marginLeft: 10, marginRight: 20 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant="h6" style={{}}>
            Here you can upload a image
          </Typography>
          <Typography variant="h6" style={{}}>
            for your blog.
          </Typography>
        </div>
      </div>

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
