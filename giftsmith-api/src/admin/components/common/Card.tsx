import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  shadow?: "sm" | "md" | "lg";
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  shadow = "md",
  border = true,
}) => {
  const paddingClasses = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const shadowClasses = {
    sm: "shadow-sm dark:shadow-gray-900/20",
    md: "shadow-md dark:shadow-gray-900/30",
    lg: "shadow-lg dark:shadow-gray-900/40",
  };

  const baseClasses = "bg-white dark:bg-gray-800 rounded-lg";
  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    border && "border border-gray-200 dark:border-gray-700",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card; 