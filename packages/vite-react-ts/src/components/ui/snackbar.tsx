import React, { useEffect, useState } from "react";

interface SnackbarProps {
  children?: React.ReactNode;
  open: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  className?: string;
}

export function Snackbar({
  children,
  open,
  autoHideDuration = 5000,
  onClose,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  className = "",
}: SnackbarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      if (autoHideDuration && onClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // 动画持续时间
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!isVisible && !open) {
    return null;
  }

  // 根据anchorOrigin设置不同的位置
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
  }[`${anchorOrigin.vertical}-${anchorOrigin.horizontal}`];

  return (
    <div
      className={`fixed z-50 transition-opacity duration-300 ${positionClasses} ${open ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}