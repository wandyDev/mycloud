import React from "react";
import clsx from "clsx";

interface ServerStatusBadgeProps {
  isStreaming: boolean;
  lastSeen?: number;
}

export default function ServerStatusBadge({
  isStreaming,
  lastSeen,
}: ServerStatusBadgeProps) {
  if (isStreaming) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
        <span>En Vivo</span>
      </span>
    );
  }

  if (lastSeen) {
    const secondsAgo = Math.floor((Date.now() - lastSeen) / 1000);
    if (secondsAgo < 60) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>Hace {secondsAgo}s</span>
        </span>
      );
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      <span>Desconectado</span>
    </span>
  );
}
