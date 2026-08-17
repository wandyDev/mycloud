import clsx from "clsx";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightIcon, className, ...props },
    ref,
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-slate-300 ml-0.5 flex items-center justify-between">
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full h-10 px-3.5 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 text-sm",
              "placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/80",
              "transition-all duration-150",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-400 ml-1">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-slate-500 ml-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
