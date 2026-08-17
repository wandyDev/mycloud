"use client";

import React, { useState, useMemo } from "react";
import clsx from "clsx";

export interface DataPoint {
  timestamp: number;
  value: number;
}

export interface SeriesData {
  name: string;
  color: string;
  unit: string;
  data: DataPoint[];
}

interface GrafanaTimeSeriesChartProps {
  title: string;
  series: SeriesData[];
  height?: number;
  yMin?: number;
  yMax?: number;
  className?: string;
}

export default function GrafanaTimeSeriesChart({
  title,
  series,
  height = 190,
  yMin = 0,
  yMax,
  className,
}: GrafanaTimeSeriesChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Compute boundaries
  const allPoints = useMemo(
    () => series.flatMap((s) => s.data),
    [series],
  );

  const calculatedMax = useMemo(() => {
    if (yMax !== undefined) return yMax;
    const maxVal = allPoints.reduce((m, p) => Math.max(m, p.value), 0);
    return Math.max(10, Math.ceil(maxVal * 1.25));
  }, [allPoints, yMax]);

  const calculatedMin = yMin;

  // Grid coordinates
  const svgWidth = 600;
  const svgHeight = height;
  const padding = { top: 15, right: 15, bottom: 25, left: 40 };

  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  // Series Stats Calculation
  const seriesStats = useMemo(() => {
    return series.map((s) => {
      if (s.data.length === 0) {
        return { name: s.name, color: s.color, unit: s.unit, min: 0, max: 0, avg: 0, current: 0 };
      }
      const values = s.data.map((d) => d.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const current = values[values.length - 1] ?? 0;

      return {
        name: s.name,
        color: s.color,
        unit: s.unit,
        min,
        max,
        avg,
        current,
      };
    });
  }, [series]);

  // Generate SVG Path for a series
  const generatePath = (data: DataPoint[]) => {
    if (data.length === 0) return { linePath: "", areaPath: "" };

    const points = data.map((d, i) => {
      const x =
        data.length === 1
          ? padding.left + innerWidth / 2
          : padding.left + (i / (data.length - 1)) * innerWidth;
      const yRatio = (d.value - calculatedMin) / (calculatedMax - calculatedMin || 1);
      const y = padding.top + innerHeight - Math.min(innerHeight, Math.max(0, yRatio * innerHeight));
      return { x, y };
    });

    const linePath = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaPath = `
      ${linePath} 
      L ${points[points.length - 1]?.x} ${padding.top + innerHeight} 
      L ${points[0]?.x} ${padding.top + innerHeight} 
      Z
    `;

    return { linePath, areaPath, points };
  };

  // Y-axis Ticks
  const yTicks = [
    calculatedMax,
    calculatedMin + (calculatedMax - calculatedMin) * 0.66,
    calculatedMin + (calculatedMax - calculatedMin) * 0.33,
    calculatedMin,
  ];

  return (
    <div
      className={clsx(
        "rounded-md border border-[#22252b] bg-[#181b1f] flex flex-col justify-between select-none overflow-hidden hover:border-[#343841] transition-colors",
        className,
      )}
    >
      {/* Chart Panel Header */}
      <div className="px-3.5 py-2 border-b border-[#22252b] bg-[#141619] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#5794F2]" />
          <span className="text-xs font-semibold text-[#d0d0d0] tracking-wide">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#73BF69] flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#73BF69] animate-ping" />
          <span>LIVE</span>
        </span>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {series.map((s, idx) => (
              <linearGradient
                key={idx}
                id={`grad-${title.replace(/\s+/g, "-")}-${idx}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
          </defs>

          {/* Horizontal Grid lines */}
          {yTicks.map((tick, i) => {
            const y = padding.top + (i / (yTicks.length - 1)) * innerHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#252932"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#686f7c"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {tick.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Time Series Paths */}
          {series.map((s, idx) => {
            const { linePath, areaPath, points } = generatePath(s.data);
            return (
              <g key={idx}>
                {/* Area Fill */}
                <path
                  d={areaPath}
                  fill={`url(#grad-${title.replace(/\s+/g, "-")}-${idx})`}
                />
                {/* Stroke Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data Points */}
                {points?.map((p, pIdx) => (
                  <circle
                    key={pIdx}
                    cx={p.x}
                    cy={p.y}
                    r={hoverIndex === pIdx ? "4" : "2"}
                    fill={s.color}
                    className="transition-all duration-150"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Grafana-style Series Legend Table */}
      <div className="px-3 py-2 border-t border-[#22252b] bg-[#141619] overflow-x-auto">
        <table className="w-full text-left font-mono text-[10px]">
          <thead>
            <tr className="text-[#686f7c] border-b border-[#22252b]">
              <th className="pb-1 font-semibold">Series</th>
              <th className="pb-1 text-right font-semibold">min</th>
              <th className="pb-1 text-right font-semibold">max</th>
              <th className="pb-1 text-right font-semibold">avg</th>
              <th className="pb-1 text-right font-semibold text-[#f1f1f1]">current</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22252b]/50">
            {seriesStats.map((st, i) => (
              <tr key={i} className="hover:bg-[#1a1d22]">
                <td className="py-1 flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-[2px]"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="text-[#a0a0a0] font-medium truncate max-w-[140px]">
                    {st.name}
                  </span>
                </td>
                <td className="py-1 text-right text-[#8e8e8e]">
                  {st.min.toFixed(2)} {st.unit}
                </td>
                <td className="py-1 text-right text-[#8e8e8e]">
                  {st.max.toFixed(2)} {st.unit}
                </td>
                <td className="py-1 text-right text-[#8e8e8e]">
                  {st.avg.toFixed(2)} {st.unit}
                </td>
                <td className="py-1 text-right font-bold text-[#f1f1f1]">
                  {st.current.toFixed(2)} {st.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
