import React from "react";
import {
  Button,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import dotenv from "dotenv";

dotenv.config();

const useStyles = makeStyles(() => ({
  divRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  divRoot2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  divRoot2Media: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  typographyUpload: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  typographyUploadMedia: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    marginBottom: 30,
  },
}));

export const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

type Props = {
  onUploadSuccess: (image: string) => void;
};

export const CloudinaryWidget: React.FC<Props> = ({ onUploadSuccess }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  // @ts-ignore
  const widget = cloudinary.createUploadWidget(
    {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      tags: ["blog-post-app"],
    },
    (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        const dataURL: string = result.info.url;
        onUploadSuccess(dataURL);
      }
    }
  );

  const showWidget = () => {
    widget.open();
  };

  return (
    <div className={classes.divRoot}>
      <div className={matches ? classes.divRoot2 : classes.divRoot2Media}>
        <img
          src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1576156104/samples/cloudinary-icon.png`}
          alt="img-widget"
          style={{ width: 70, height: 50, marginLeft: 10, marginRight: 20 }}
        />
        <div
          className={
            matches ? classes.typographyUpload : classes.typographyUploadMedia
          }
        >
          {matches ? (
            <div>
              {" "}
              <Typography variant={matches ? "h6" : "body1"}>
                Here you can upload a image
              </Typography>
              <Typography variant={matches ? "h6" : "body1"}>
                for your blog.
              </Typography>{" "}
            </div>
          ) : (
            <Typography
              variant={matches ? "h6" : "body1"}
              style={{ textAlign: "center" }}
            >
              Here you can upload a image for your blog.
            </Typography>
          )}
        </div>
      </div>

      <Button
        onClick={showWidget}
        variant="outlined"
        color="default"
        size={matches ? "large" : "small"}
        className={matches ? undefined : classes.uploadButton}
      >
        Upload Photo
      </Button>
    </div>
  );
};
