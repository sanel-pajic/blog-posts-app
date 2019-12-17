import React from "react";
import { Button } from "@material-ui/core";

type Props = {
  onUploadSuccess: (image: string) => void;
};

export const CloudinaryWidget: React.FC<Props> = ({ onUploadSuccess }) => {
  // @ts-ignore
  const widget = cloudinary.createUploadWidget(
    {
      cloudName: "dz2f3jhr6",
      uploadPreset: "df3ezjvs"
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
    <div>
      <Button onClick={showWidget} variant="contained" color="primary">
        Upload Photo
      </Button>
    </div>
  );
};
