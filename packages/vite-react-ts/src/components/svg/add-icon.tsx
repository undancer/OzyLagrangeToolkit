import React from "react";

interface AddIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function AddIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: AddIconProps): React.JSX.Element {
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
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}