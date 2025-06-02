import React from "react";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  edge?: "start" | "end" | false;
}

export function IconButton({
  children,
  className = "",
  color = "default",
  disabled = false,
  size = "medium",
  edge = false,
  ...rest
}: IconButtonProps) {
  // 设置颜色
  const colorClasses = {
    default: "text-gray-500 hover:bg-gray-100",
    primary: "text-blue-500 hover:bg-blue-50",
    secondary: "text-purple-500 hover:bg-purple-50",
    error: "text-red-500 hover:bg-red-50",
    info: "text-sky-500 hover:bg-sky-50",
    success: "text-green-500 hover:bg-green-50",
    warning: "text-amber-500 hover:bg-amber-50",
  }[color];

  // 设置大小
  const sizeClasses = {
    small: "p-1",
    medium: "p-2",
    large: "p-3",
  }[size];

  // 设置边缘
  const edgeClasses = {
    start: "ml-0",
    end: "mr-0",
    false: "",
  }[edge === false ? "false" : edge];

  // 设置禁用状态
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full transition-colors ${colorClasses} ${sizeClasses} ${edgeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}