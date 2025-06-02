import React from "react";

interface HourglassDisabledIconProps {
  className?: string;
}

export function HourglassDisabledIcon({
  className = "",
}: HourglassDisabledIconProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="24"
      height="24"
    >
      <path d="M3 2h18v2h-18zM21 20v2h-18v-2h18zM13 13.17l2 2V10h-6v2.17l2 2v-2.17h2v1.17zM10 16.83V20h4v-3.17l-2-2-2 2zM18 7.17V4h-12v3.17l6 6 6-6zM2.1 2.1L.69 3.51 8.17 11l-6.17 6.17L3.5 18.67 11 11.17l8.5 8.5 1.41-1.41L2.1 2.1z" />
    </svg>
  );
}