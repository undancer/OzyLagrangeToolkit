import React from "react";

interface MenuIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function MenuIcon({
  className = "w-6 h-6",
  width,
  height,
  color = "currentColor",
}: MenuIconProps): React.JSX.Element {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}