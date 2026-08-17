import clsx from "clsx";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerAction?: React.ReactNode;
  badge?: React.ReactNode;
}

export default function Card({
  children,
  className,
  title,
  description,
  headerAction,
  badge,
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col gap-5 shadow-xl shadow-black/40",
        className,
      )}
    >
      {(title || description || headerAction || badge) && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              {typeof title === "string" ? (
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {title}
                </h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {description && (
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
