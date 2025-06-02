import React from "react";

interface NumbersIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function NumbersIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: NumbersIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 4L4 8L8 12"></path>
      <path d="M16 4L20 8L16 12"></path>
      <path d="M10 20h4"></path>
      <path d="M12 16v4"></path>
    </svg>
  );
}