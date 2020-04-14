import * as React from "react";
import { GalleryImage, Gallery } from "react-gesture-gallery";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CLOUD_NAME } from "./CloudinaryWidget";

export const ImageCarousel: React.FC = () => {
  const [listImages, setListImages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios
      .get(
        `http://res.cloudinary.com/${CLOUD_NAME}/image/list/blog-post-app.json
      `
      )
      .then((result) => setListImages(result.data.resources));
  }, []);

  //console.log("DATA IMAGES", listImages);

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#282c34",
          width: "50vw",
          height: "50vh",
        }}
      >
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
