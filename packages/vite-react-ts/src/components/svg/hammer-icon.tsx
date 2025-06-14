import React from "react";

interface HammerIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function HammerIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: HammerIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M2 19.63L13.43 8.2L12.72 7.5L14.14 6.07L12 3.89C13.2 2.7 15.09 2.7 16.27 3.89L19.87 7.5L18.45 8.91H21.29L22 9.62L18.45 13.21L17.74 12.5V9.62L16.27 11.04L15.56 10.33L4.13 21.76L2 19.63Z" />
    </svg>
  );
}