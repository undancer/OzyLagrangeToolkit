import React from "react";

interface AlarmAddIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function AlarmAddIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: AlarmAddIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M13,9H11V12H8V14H11V17H13V14H16V12H13V9Z" />
    </svg>
  );
}