import React from "react";

interface DeveloperBoardIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function DeveloperBoardIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: DeveloperBoardIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z" />
    </svg>
  );
}