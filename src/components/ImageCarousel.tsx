import * as React from "react";
//import * as images from '../images/imagesGallery';
import image1 from "../images/imagesGallery/image-1.jpg";
import image2 from "../images/imagesGallery/image-2.jpg";
import image3 from "../images/imagesGallery/image-3.jpg";
import image4 from "../images/imagesGallery/image-4.jpg";
import image5 from "../images/imagesGallery/image-5.jpg";
import image6 from "../images/imagesGallery/image-6.jpg";
import image7 from "../images/imagesGallery/image-7.jpg";
import { GalleryImage, Gallery } from "react-gesture-gallery";
import { useState } from "react";

const images = [
  {
    src: image1
  },
  {
    src: image2
  },
  {
    src: image3
  },
  {
    src: image4
  },
  {
    src: image5
  },
  {
    src: image6
  },
  {
    src: image7
  }
];

export const ImageCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (index === images.length - 1) {
        setIndex(0);
      } else {
        setIndex(prev => prev + 1);
      }
    }, 5500);
    return () => clearInterval(timer);
  }, [index]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#282c34",
        width: "50vw",
        height: "50vh"
      }}
    >
      <Gallery
        index={index}
        onRequestChange={i => {
          setIndex(i);
        }}
      >
        {images.map(img => (
          <GalleryImage key={img.src} src={img.src} objectFit="contain" />
        ))}
      </Gallery>
    </div>
  );
};
