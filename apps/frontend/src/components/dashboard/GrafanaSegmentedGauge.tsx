import React from "react";
import clsx from "clsx";

interface SegmentedBarProps {
  label: string;
  percentage: number;
  segmentsCount?: number;
  className?: string;
}

export default function GrafanaSegmentedGauge({
  label,
  percentage,
  segmentsCount = 18,
  className,
}: SegmentedBarProps) {
  const safePercent = Math.min(100, Math.max(0, isNaN(percentage) ? 0 : percentage));
  const activeSegments = Math.round((safePercent / 100) * segmentsCount);

  // Determine segment color gradient (green -> yellow -> red)
  const getSegmentColor = (index: number) => {
    const ratio = index / segmentsCount;
    if (ratio < 0.6) return "bg-[#73BF69]"; // Green
    if (ratio < 0.8) return "bg-[#FF9830]"; // Orange
    return "bg-[#F2495C]"; // Red
  };

  return (
    <div
      className={clsx(
        "rounded-md border border-[#22252b] bg-[#181b1f] p-3 space-y-2 select-none",
        className,
      )}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-medium text-[#a0a0a0] truncate">
          {label}
        </span>
        <span className="font-mono text-xs font-bold text-[#f1f1f1]">
          {safePercent.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: segmentsCount }).map((_, i) => {
          const isActive = i < activeSegments;
          return (
            <div
              key={i}
              className={clsx(
                "h-4 flex-1 rounded-[1px] transition-all duration-300",
                isActive ? getSegmentColor(i) : "bg-[#252830]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
