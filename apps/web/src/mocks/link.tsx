// mocks/next/link.js
import React from "react";

/* eslint-disable react/prop-types */
const Link = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;
