import React from "react";
import type { AgentPayload } from "@/types/backend";
import { Activity, Clock, Cpu, Database } from "lucide-react";

interface TelemetryStreamProps {
  metrics: AgentPayload[];
}

export default function TelemetryStream({ metrics }: TelemetryStreamProps) {
  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">
        <Activity className="h-8 w-8 text-slate-600 animate-pulse" />
        <div>
          <p className="text-sm font-medium text-slate-300">
            Esperando telemetría en tiempo real
          </p>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Inicia tu agente para comenzar a transmitir métricas cada 30 segundos automáticamente por WebSockets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      {metrics.map((item, index) => {
        const timeStr = item.timestamp
          ? new Date(item.timestamp).toLocaleTimeString()
          : "Reciente";

        const cpuNum =
          typeof item.metrics.cpuLoad === "number"
            ? item.metrics.cpuLoad
            : parseFloat(String(item.metrics.cpuLoad)) || 0;

        return (
          <div
            key={`${item.timestamp || index}-${index}`}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/50 hover:bg-slate-900/60 transition-colors text-xs gap-3"
          >
            {/* Timestamp & Status */}
            <div className="flex items-center gap-2.5 min-w-[120px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>{timeStr}</span>
              </div>
              {index === 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Actual
                </span>
              )}
            </div>

            {/* CPU Metric */}
            <div className="flex items-center gap-2 flex-1 max-w-[180px]">
              <Cpu className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">CPU</span>
                  <span className="font-mono text-slate-200 font-medium">
                    {String(item.metrics.cpuLoad)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, cpuNum))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RAM Metric */}
            <div className="flex items-center gap-2 flex-1 max-w-[180px]">
              <Database className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">RAM</span>
                  <span className="font-mono text-slate-200 font-medium">
                    {String(item.metrics.ramUsed)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `50%` }}
                  />
                </div>
              </div>
            </div>

            {/* Uptime */}
            <div className="text-right text-slate-400 font-mono text-[11px] hidden sm:block">
              <span className="text-slate-500">Uptime: </span>
              {String(item.metrics.uptime)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
