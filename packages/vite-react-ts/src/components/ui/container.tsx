import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fixed?: boolean;
  disableGutters?: boolean;
  component?: React.ElementType;
};

export function Container({
  children,
  className = '',
  maxWidth = 'lg',
  fixed = false,
  disableGutters = false,
  component: Component = 'div',
}: ContainerProps) {
  const maxWidthClass = maxWidth ? {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth] : '';

  const classes = [
    'mx-auto',
    maxWidthClass,
    fixed ? 'w-full' : '',
    !disableGutters ? 'px-4' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
}