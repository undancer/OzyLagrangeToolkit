import React from "react";

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
}

export function TableContainer({
  children,
  className = "",
  component: Component = "div",
  ...rest
}: TableContainerProps) {
  return (
    <Component className={`overflow-auto ${className}`} {...rest}>
      {children}
    </Component>
  );
}