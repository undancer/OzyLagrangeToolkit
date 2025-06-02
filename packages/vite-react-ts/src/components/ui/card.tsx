import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  elevation?: number;
}

export function Card({
  children,
  className = "",
  elevation = 1,
  ...rest
}: CardProps) {
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

  return (
    <div
      className={`bg-white rounded-md overflow-hidden ${shadowClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}