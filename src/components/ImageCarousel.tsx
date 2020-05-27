import * as React from "react";
import { GalleryImage, Gallery } from "react-gesture-gallery";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CLOUD_NAME } from "./CloudinaryWidget";
import { useMediaQuery, useTheme, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  divRoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#282c34",
    width: "50vw",
    height: "50vh",
  },
  divRootMedia: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#282c34",
    width: "100vw",
    height: "27vh",
  },
}));

export const ImageCarousel: React.FC = () => {
  const [listImages, setListImages] = useState([]);
  const [index, setIndex] = useState(0);
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    let ignore = false;

    axios
      .get(
        `http://res.cloudinary.com/${CLOUD_NAME}/image/list/blog-post-app.json
      `
      )
      .then((result) => {
        if (!ignore) setListImages(result.data.resources);
      });
    return () => {
      ignore = true;
    };
  }, []);

  useInterval(() => {
    if (index === listImages.length - 1) {
      setIndex(0);
    } else {
      setIndex((prev) => prev + 1);
    }
  }, 5500);

  function useInterval(callback: (() => void) | undefined, delay: number) {
    const savedCallback = useRef();

    useEffect(() => {
      //@ts-ignore
      savedCallback.current = callback;
    });

    useEffect(() => {
      function tick() {
        //@ts-ignore
        savedCallback.current();
      }

      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  }

  return (
    <div>
      <div className={matches ? classes.divRoot : classes.divRootMedia}>
        <Gallery
          enableControls={true}
          enableKeyboard={true}
          index={index}
          onRequestChange={(i) => {
            setIndex(i);
          }}
        >
          {listImages.map((img: any) => (
            <a
              key={img.public_id}
              // eslint-disable-next-line react/jsx-no-target-blank
              target="_blank"
              href={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${img.version}/${img.public_id}.jpg`}
              style={{ width: "100%", height: "100%" }}
            >
              <GalleryImage
                src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${img.version}/${img.public_id}.jpg`}
                objectFit="contain"
              />
            </a>
          ))}
        </Gallery>
      </div>
    </div>
  );
};
