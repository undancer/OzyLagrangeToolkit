import React from "react";

interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  elevation?: number;
  square?: boolean;
}

export function Paper({
  children,
  className = "",
  elevation = 1,
  square = false,
  ...rest
}: PaperProps) {
  // 根据elevation设置不同的阴影效果
  const shadowClass =
    {
      0: "",
      1: "shadow-sm",
      2: "shadow",
      3: "shadow-md",
      4: "shadow-lg",
      5: "shadow-xl",
    }[Math.min(5, Math.max(0, elevation))] || "";

  // 设置圆角
  const roundedClass = square ? "" : "rounded-md";

  return (
    <div
      className={`bg-white ${shadowClass} ${roundedClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}