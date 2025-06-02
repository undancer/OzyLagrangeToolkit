import React from "react";

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  variant?: "standard" | "outlined" | "filled";
  size?: "small" | "medium";
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
}

export function TextField({
  label,
  variant = "outlined",
  size = "medium",
  fullWidth = false,
  error = false,
  helperText,
  className = "",
  ...rest
}: TextFieldProps) {
  // 根据variant设置不同的样式
  const variantClasses = {
    standard: "border-b border-gray-300 focus-within:border-blue-500",
    outlined: "border border-gray-300 rounded focus-within:border-blue-500",
    filled:
      "bg-gray-100 border-b-2 border-gray-300 focus-within:border-blue-500",
  }[variant];

  // 根据size设置不同的大小
  const sizeClasses = {
    small: "text-sm py-1",
    medium: "text-base py-2",
  }[size];

  // 设置宽度
  const widthClass = fullWidth ? "w-full" : "";

  // 设置错误状态
  const errorClasses = error
    ? "border-red-500 focus-within:border-red-500"
    : "";

  return (
    <div className={`flex flex-col ${widthClass} ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={`relative ${variantClasses} ${errorClasses}`}>
        <input
          className={`w-full px-3 ${sizeClasses} bg-transparent outline-none`}
          {...rest}
        />
      </div>
      {helperText && (
        <p
          className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}