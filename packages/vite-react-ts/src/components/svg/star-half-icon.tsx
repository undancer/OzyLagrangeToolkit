import React from "react";

interface StarHalfIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function StarHalfIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: StarHalfIconProps): React.JSX.Element {
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
      <path d="M12 17.8L5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"></path>
      <path d="M12 2L15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8"></path>
      <path fill={color} d="M12 2L12 17.8"></path>
    </svg>
  );
}