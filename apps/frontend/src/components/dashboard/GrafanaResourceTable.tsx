import React from "react";
import clsx from "clsx";

export interface ResourceRow {
  resource: string;
  target: string;
  role: string;
  totalSize: string;
  available: string;
  usedPercentage: number;
}

interface GrafanaResourceTableProps {
  title?: string;
  rows: ResourceRow[];
  className?: string;
}

export default function GrafanaResourceTable({
  title = "Resource Telemetry & Capacity Breakdown",
  rows,
  className,
}: GrafanaResourceTableProps) {
  const getBadgeStyle = (pct: number) => {
    if (pct > 80) return "bg-[#F2495C]/20 text-[#F2495C] border border-[#F2495C]/40";
    if (pct > 50) return "bg-[#FF9830]/20 text-[#FF9830] border border-[#FF9830]/40";
    return "bg-[#73BF69]/20 text-[#73BF69] border border-[#73BF69]/40";
  };

  return (
    <div
      className={clsx(
        "rounded-md border border-[#22252b] bg-[#181b1f] overflow-hidden flex flex-col justify-between select-none",
        className,
      )}
    >
      <div className="px-3.5 py-2.5 border-b border-[#22252b] bg-[#141619] flex items-center justify-between">
        <span className="text-xs font-semibold text-[#d0d0d0] tracking-wide">
          {title}
        </span>
        <span className="text-[10px] font-mono text-[#73BF69] flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#73BF69] animate-pulse" />
          <span>Real-Time Node Exporter</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#22252b] text-[10px] uppercase text-[#7a7a7a] bg-[#16181d]">
              <th className="py-2 px-3 font-semibold">Resource</th>
              <th className="py-2 px-3 font-semibold">Target / ID</th>
              <th className="py-2 px-3 font-semibold">Subsystem</th>
              <th className="py-2 px-3 font-semibold">Capacity</th>
              <th className="py-2 px-3 font-semibold">Available</th>
              <th className="py-2 px-3 font-semibold text-right">Used %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22252b]/60">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#1f2329] transition-colors text-[11px]">
                <td className="py-2 px-3 text-[#5794F2] font-semibold">
                  {row.resource}
                </td>
                <td className="py-2 px-3 text-[#9a9a9a] truncate max-w-[120px]">
                  {row.target}
                </td>
                <td className="py-2 px-3 text-[#a0a0a0]">{row.role}</td>
                <td className="py-2 px-3 text-[#e0e0e0] font-bold">
                  {row.totalSize}
                </td>
                <td className="py-2 px-3 text-[#73BF69]">{row.available}</td>
                <td className="py-2 px-3 text-right">
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded text-[10px] font-bold inline-block font-mono min-w-[50px]",
                      getBadgeStyle(row.usedPercentage),
                    )}
                  >
                    {row.usedPercentage.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
