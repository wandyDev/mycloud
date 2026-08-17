import React from "react";
import clsx from "clsx";

interface MetricGaugeProps {
  percentage: number;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function MetricGauge({
  percentage,
  label,
  className,
}: MetricGaugeProps) {
  const safePercentage = Math.min(100, Math.max(0, isNaN(percentage) ? 0 : percentage));

  // Determine color based on usage threshold
  const getColor = () => {
    if (safePercentage > 85) {
      return {
        bar: "from-rose-500 to-red-600",
        text: "text-rose-400",
        glow: "shadow-rose-500/30",
        bg: "bg-rose-500/10",
      };
    }
    if (safePercentage > 65) {
      return {
        bar: "from-amber-400 to-orange-500",
        text: "text-amber-400",
        glow: "shadow-amber-500/30",
        bg: "bg-amber-500/10",
      };
    }
    return {
      bar: "from-emerald-400 to-cyan-500",
      text: "text-emerald-400",
      glow: "shadow-cyan-500/30",
      bg: "bg-cyan-500/10",
    };
  };

  const colors = getColor();

  return (
    <div className={clsx("w-full space-y-1.5", className)}>
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">{label}</span>
          <span className={clsx("font-semibold font-mono", colors.text)}>
            {safePercentage.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
        <div
          className={clsx(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out shadow-sm",
            colors.bar,
            colors.glow,
          )}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}
