import React from "react";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
}

export function Box({
  children,
  className = "",
  component: Component = "div",
  ...rest
}: BoxProps) {
  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
}