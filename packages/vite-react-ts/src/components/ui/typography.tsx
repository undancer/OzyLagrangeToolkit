import React from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline";
  component?: React.ElementType;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  gutterBottom?: boolean;
}

export function Typography({
  children,
  className = "",
  variant = "body1",
  component,
  align = "inherit",
  gutterBottom = false,
  ...rest
}: TypographyProps) {
  // 根据variant设置不同的样式和默认组件
  const variantMapping: Record<string, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
    caption: "span",
    button: "span",
    overline: "span",
  };

  const Component = component || variantMapping[variant] || "span";

  // 根据variant设置不同的样式
  const variantClasses = {
    h1: "text-4xl font-light",
    h2: "text-3xl font-light",
    h3: "text-2xl font-medium",
    h4: "text-xl font-medium",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
    subtitle1: "text-base",
    subtitle2: "text-sm font-medium",
    body1: "text-base",
    body2: "text-sm",
    caption: "text-xs",
    button: "text-sm font-medium uppercase",
    overline: "text-xs font-medium uppercase tracking-wider",
  }[variant];

  // 根据align设置不同的对齐方式
  const alignClasses = {
    inherit: "",
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[align];

  // 设置下边距
  const gutterClass = gutterBottom ? "mb-2" : "";

  return (
    <Component
      className={`${variantClasses} ${alignClasses} ${gutterClass} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}