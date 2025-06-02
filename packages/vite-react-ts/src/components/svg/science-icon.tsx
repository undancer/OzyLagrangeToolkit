import React from "react";

interface ScienceIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function ScienceIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: ScienceIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M19.8 18.4L14 10.67V6.5L15.5 5H18.5L20 6.5V5H18.5L15.5 2H8.5L5.5 5H4V6.5L5.5 5H8.5L10 6.5V10.67L4.2 18.4C3.53 19.17 4.08 20 5 20H19C19.92 20 20.47 19.17 19.8 18.4M7.89 18L9.5 15.89L11.11 18H7.89M16.11 18L14.5 15.89L12.89 18H16.11Z" />
    </svg>
  );
}