import React from "react";

interface LockOpenIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function LockOpenIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: LockOpenIconProps): React.JSX.Element {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
  );
}