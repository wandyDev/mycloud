import React from "react";
import clsx from "clsx";

interface GrafanaStatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  color?: "green" | "cyan" | "amber" | "purple" | "rose";
  className?: string;
}

const colorMap = {
  green: "text-[#73BF69] border-[#73BF69]/20 bg-[#73BF69]/5",
  cyan: "text-[#5794F2] border-[#5794F2]/20 bg-[#5794F2]/5",
  amber: "text-[#FF9830] border-[#FF9830]/20 bg-[#FF9830]/5",
  purple: "text-[#B877D9] border-[#B877D9]/20 bg-[#B877D9]/5",
  rose: "text-[#F2495C] border-[#F2495C]/20 bg-[#F2495C]/5",
};

export default function GrafanaStatTile({
  label,
  value,
  unit,
  sublabel,
  color = "green",
  className,
}: GrafanaStatTileProps) {
  return (
    <div
      className={clsx(
        "rounded-md border border-[#22252b] bg-[#181b1f] p-3.5 flex flex-col justify-between select-none hover:border-[#343841] transition-colors",
        className,
      )}
    >
      <div className="text-[11px] font-medium text-[#8e8e8e] tracking-wide uppercase">
        {label}
      </div>

      <div className="my-1.5 flex items-baseline gap-1.5">
        <span
          className={clsx(
            "text-2xl sm:text-3xl font-bold font-mono tracking-tight",
            colorMap[color].split(" ")[0],
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-[#8e8e8e] font-semibold">
            {unit}
          </span>
        )}
      </div>

      {sublabel && (
        <div className="text-[10px] font-mono text-[#6e6e6e] truncate">
          {sublabel}
        </div>
      )}
    </div>
  );
}
