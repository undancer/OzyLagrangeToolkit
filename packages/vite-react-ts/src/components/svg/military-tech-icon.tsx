import React from "react";

interface MilitaryTechIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function MilitaryTechIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: MilitaryTechIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M17,10.43V2H7V10.43C7,10.79 7.18,11.13 7.46,11.33L11.5,14L8,18H18L14.5,14L18.54,11.33C18.82,11.13 19,10.79 19,10.43L17,10.43M7,20H17V22H7V20Z" />
    </svg>
  );
}