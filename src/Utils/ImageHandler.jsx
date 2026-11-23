import React from "react";

const BASE_IMAGE_URL = "https://onstores.in/onstores_apis/api/";

const ImageHandler = ({
  src,
  alt = "Image",
  width = 60,
  height = 60,
  className = "",
  style = {},
}) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/60?text=No+Image";
    }

    // If already full URL
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/\\/g, "").replace(/^\/+/, "");

    return `${BASE_IMAGE_URL}${cleanPath}`;
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={`rounded border ${className}`}
      style={{
        width,
        height,
        objectFit: "cover",
        ...style,
      }}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/60?text=No+Image";
      }}
    />
  );
};

export default ImageHandler;
