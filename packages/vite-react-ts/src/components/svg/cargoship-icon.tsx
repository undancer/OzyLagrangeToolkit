import React from "react";

interface CargoShipIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
}

export function CargoShipIcon({
  className = "",
  width = 24,
  height = 24,
  color = "currentColor",
}: CargoShipIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 512 512"
      fill={color}
      className={className}
    >
      <path d="m480.002,264.126h-16.001v-80.25c0-17.672-14.327-31.75-31.999-31.75h-160c-17.672,0-32.001,14.078-32.001,31.75v80.25h-32v-96h-64v-32h64.001c0-18-14.328-32-32-32h-16.001v-16.25c0-17.672-14.328-32-32-32s-32,14.328-32,32v16c-18,0-32,14.328-32,32v32c-18,0-32,14.328-32,32v64c-11,0-20.546,5.266-26.5,14.063-5.953,8.789-7.156,19.961-3.211,29.82l27.649,69.117-12.297,36.883c-3.25,9.758-1.617,20.609 4.399,28.953 6.016,8.344 15.672,13.414 25.961,13.414h304c88.227,0 160-71.773 160-160 0-17.672-14.329-32-32-32zm-176.001-48h-16v48h-16v-64h32v16zm64,0h-16v48h-16v-64h32v16zm64,0h-16v48h-16v-64h32v16z" />
    </svg>
  );
}