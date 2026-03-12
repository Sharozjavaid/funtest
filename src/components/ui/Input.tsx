"use client";

import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-heading font-medium text-sm text-bark">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2.5 rounded-2xl bg-sand border-2 border-transparent focus:border-honey focus:outline-none text-bark placeholder:text-bark-light/60 ${className}`}
        {...props}
      />
    </div>
  );
}
