import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  fullWidth?: boolean;
  error?: boolean;
  disableUnderline?: boolean;
}

export function Input({
  className = "",
  fullWidth = false,
  error = false,
  disableUnderline = false,
  ...rest
}: InputProps) {
  // 设置宽度
  const widthClass = fullWidth ? "w-full" : "";

  // 设置下划线
  const underlineClass = disableUnderline ? "" : "border-b";

  // 设置错误状态
  const errorClasses = error
    ? "border-red-500 focus:border-red-500"
    : "border-gray-300 focus:border-blue-500";

  return (
    <input
      className={`px-2 py-1 bg-transparent outline-none transition-colors ${underlineClass} ${errorClasses} ${widthClass} ${className}`}
      {...rest}
    />
  );
}