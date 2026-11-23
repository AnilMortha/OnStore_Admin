import React from "react";

const BASE_URL = "https://onstores.in/onstores_apis/";

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

    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    if (imagePath.startsWith("blob:") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // Clean the path - remove backslashes and 'api/' prefix
    let cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    
    // Remove 'api/' if present in the path
    cleanPath = cleanPath.replace(/^api\//, '');
    
    // Build URL - direct to uploads folder
    return `${BASE_URL}${cleanPath}`;
  };

  const imageUrl = getImageUrl(src);

  return (
    <img
      src={imageUrl}
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