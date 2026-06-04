// mocks/next/image.tsx
import React from "react";

/* eslint-disable react/prop-types */
const Image = ({
  src,
  alt,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { width?: number; height?: number }) => {
  return <img src={typeof src === "string" ? src : ""} alt={alt} width={width} height={height} {...props} />;
};

export default Image;
