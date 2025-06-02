import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Button({
  children,
  className = "",
  variant = "contained",
  size = "medium",
  color = "primary",
  startIcon,
  endIcon,
  ...rest
}: ButtonProps) {
  // 根据variant设置不同的样式
  const variantClasses = {
    text: `text-${color}-600 hover:bg-${color}-50`,
    outlined: `border border-${color}-600 text-${color}-600 hover:bg-${color}-50`,
    contained: `bg-${color}-600 text-white hover:bg-${color}-700`,
  }[variant];

  // 根据size设置不同的大小
  const sizeClasses = {
    small: "text-xs py-1 px-2",
    medium: "text-sm py-2 px-4",
    large: "text-base py-3 px-6",
  }[size];

  return (
    <button
      className={`rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-opacity-50 ${variantClasses} ${sizeClasses} ${className}`}
      {...rest}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}