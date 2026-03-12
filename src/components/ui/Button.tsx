"use client";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "font-heading font-semibold rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-honey/50 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-honey text-white hover:bg-honey-dark",
    secondary: "bg-sand text-bark hover:bg-sand-dark",
    ghost: "bg-transparent text-bark hover:bg-sand",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
