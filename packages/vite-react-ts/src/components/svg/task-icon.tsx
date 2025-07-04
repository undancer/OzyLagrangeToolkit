import React from "react";

interface TaskIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  fontSize?: "small" | "medium" | "large";
}

export function TaskIcon({
  className = "",
  width,
  height,
  color = "currentColor",
  fontSize = "medium",
}: TaskIconProps): React.JSX.Element {
  // 根据fontSize设置尺寸
  let size = 24;
  if (fontSize === "small") size = 20;
  if (fontSize === "large") size = 36;

  // 如果明确指定了width和height，则使用指定的值
  const finalWidth = width || size;
  const finalHeight = height || size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M19.79,10.22C19.92,10.79,20,11.39,20,12 c0,4.42-3.58,8-8,8s-8-3.58-8-8c0-4.42,3.58-8,8-8c1.58,0,3.04,0.46,4.28,1.25l1.44-1.44C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12 c0,5.52,4.48,10,10,10s10-4.48,10-10c0-1.19-0.22-2.33-0.6-3.39L19.79,10.22z" />
    </svg>
  );
}