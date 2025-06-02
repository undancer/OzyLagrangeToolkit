import React from "react";

interface PercentIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function PercentIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: PercentIconProps): React.JSX.Element {
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
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  );
}