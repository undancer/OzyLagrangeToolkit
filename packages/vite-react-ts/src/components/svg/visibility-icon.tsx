import React from "react";

interface VisibilityIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function VisibilityIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: VisibilityIconProps): React.JSX.Element {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}