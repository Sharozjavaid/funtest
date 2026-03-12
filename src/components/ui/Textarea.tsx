"use client";

import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-heading font-medium text-sm text-bark">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-2.5 rounded-2xl bg-sand border-2 border-transparent focus:border-honey focus:outline-none text-bark placeholder:text-bark-light/60 resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
