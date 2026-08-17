import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "danger" | "glow";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const variants = {
  default:
    "bg-sky-500 text-white hover:bg-sky-400 active:scale-[0.98] shadow-lg shadow-sky-500/20 font-medium transition-all duration-200",
  glow: "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 font-semibold transition-all duration-200 border border-sky-400/30",
  outline:
    "border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white active:scale-[0.98] transition-all duration-200",
  ghost:
    "text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-[0.98] transition-colors",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 active:scale-[0.98] shadow-lg shadow-rose-600/20 transition-all duration-200",
  link: "text-sky-400 underline-offset-4 hover:underline hover:text-sky-300",
};

const sizes = {
  default: "h-10 px-4 py-2 rounded-xl text-sm font-medium gap-2",
  sm: "h-8 rounded-lg px-3 text-xs gap-1.5",
  lg: "h-12 rounded-xl px-6 text-base gap-2.5 font-semibold",
  icon: "h-9 w-9 rounded-xl p-0 justify-center",
};

export default function Button({
  variant = "default",
  size = "default",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:pointer-events-none disabled:opacity-50 select-none",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
