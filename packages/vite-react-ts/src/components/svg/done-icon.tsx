import React from "react";

interface DoneIconProps {
  className?: string;
  color?: string;
}

export function DoneIcon({
  className = "",
  color = "currentColor",
}: DoneIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      width="24"
      height="24"
    >
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}