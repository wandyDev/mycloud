import React from "react";
import clsx from "clsx";
import MetricGauge from "./MetricGauge";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  percentage?: number;
  trend?: "up" | "down" | "stable";
  color?: "cyan" | "emerald" | "amber" | "indigo" | "purple";
  badge?: string;
}

const colorStyles = {
  cyan: {
    iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    border: "hover:border-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/10",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    border: "hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
  },
  amber: {
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    border: "hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    border: "hover:border-indigo-500/30",
    glow: "group-hover:shadow-indigo-500/10",
  },
  purple: {
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    border: "hover:border-purple-500/30",
    glow: "group-hover:shadow-purple-500/10",
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  percentage,
  color = "cyan",
  badge,
}: MetricCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={clsx(
        "group relative rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-black/30",
        styles.border,
        styles.glow,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold tracking-tight text-white font-mono">
              {value}
            </h4>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div
          className={clsx(
            "p-2.5 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
            styles.iconBg,
          )}
        >
          {icon}
        </div>
      </div>

      {percentage !== undefined && (
        <MetricGauge percentage={percentage} />
      )}

      {subtitle && (
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800/50">
          {subtitle}
        </p>
      )}
    </div>
  );
}
