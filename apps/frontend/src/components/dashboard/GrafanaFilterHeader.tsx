"use client";

import React from "react";
import { ServerRecord } from "@/types/backend";
import {
  Server,
  Plus,
  RefreshCw,
  LogOut,
  Key,
  Layers,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/ui/button";

interface GrafanaFilterHeaderProps {
  servers: ServerRecord[];
  selectedServerId: string | null;
  onSelectServer: (serverId: string) => void;
  socketStatus: "connected" | "connecting" | "disconnected" | "error";
  onOpenCreateModal: () => void;
  onRefreshServers: () => void;
  onGenerateToken: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
}

export default function GrafanaFilterHeader({
  servers,
  selectedServerId,
  onSelectServer,
  socketStatus,
  onOpenCreateModal,
  onRefreshServers,
  onGenerateToken,
  onLogout,
  isRefreshing = false,
}: GrafanaFilterHeaderProps) {
  const selectedServer = servers.find((s) => s.serverId === selectedServerId);

  return (
    <div className="w-full border-b border-[#22252b] bg-[#111317] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none text-xs font-mono">
      {/* Left side: Breadcrumb & Grafana Filter Variables */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Dashboard Title / Breadcrumb */}
        <div className="flex items-center gap-2 pr-2 border-r border-[#22252b]">
          <div className="h-6 w-6 rounded bg-[#FF9830] flex items-center justify-center text-black font-bold text-xs shadow-sm">
            G
          </div>
          <span className="font-semibold text-[#f1f1f1] tracking-tight">
            MyCloud
          </span>
          <span className="text-[#686f7c]">/</span>
          <span className="text-[#a0a0a0] hidden sm:inline">Node Exporter Telemetry</span>
        </div>

        {/* Host Filter Dropdown */}
        <div className="flex items-center gap-1 bg-[#181b1f] border border-[#2e323b] rounded px-2.5 py-1">
          <span className="text-[#686f7c] uppercase font-bold text-[10px]">Host:</span>
          <div className="relative">
            <select
              value={selectedServerId || ""}
              onChange={(e) => onSelectServer(e.target.value)}
              className="bg-transparent text-[#5794F2] font-semibold text-xs appearance-none pr-4 outline-none cursor-pointer"
            >
              {servers.map((s) => (
                <option key={s.id} value={s.serverId} className="bg-[#181b1f] text-white">
                  {s.name}
                </option>
              ))}
              {servers.length === 0 && (
                <option value="" disabled className="bg-[#181b1f] text-slate-400">
                  Sin servidores
                </option>
              )}
            </select>
            <ChevronDown className="h-3 w-3 text-[#5794F2] absolute right-0 top-1 pointer-events-none" />
          </div>
        </div>

        {/* Server ID Pill */}
        {selectedServer && (
          <div className="hidden lg:flex items-center gap-1.5 bg-[#181b1f] border border-[#2e323b] rounded px-2 py-1 text-[11px] text-[#8e8e8e]">
            <Server className="h-3 w-3 text-[#73BF69]" />
            <span className="truncate max-w-[120px]">
              ID: {selectedServer.serverId.slice(0, 8)}...
            </span>
          </div>
        )}

        {/* Interval Pill */}
        <div className="hidden sm:flex items-center gap-1 bg-[#181b1f] border border-[#2e323b] rounded px-2 py-1 text-[11px] text-[#73BF69]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#73BF69] animate-pulse" />
          <span>Interval: Live 30s</span>
        </div>
      </div>

      {/* Right side: Action Controls & Status */}
      <div className="flex items-center gap-2">
        {/* Socket Status Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#181b1f] border border-[#2e323b] text-[11px]">
          <span
            className={`h-2 w-2 rounded-full ${
              socketStatus === "connected"
                ? "bg-[#73BF69] pulse-dot"
                : socketStatus === "connecting"
                  ? "bg-[#FF9830] animate-ping"
                  : "bg-[#F2495C]"
            }`}
          />
          <span className="text-[#a0a0a0] capitalize font-medium hidden sm:inline">
            {socketStatus}
          </span>
        </div>

        <button
          type="button"
          onClick={onRefreshServers}
          title="Refrescar Servidores"
          className="p-1.5 rounded border border-[#2e323b] bg-[#181b1f] text-[#a0a0a0] hover:text-white hover:bg-[#252830] transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>

        <button
          type="button"
          onClick={onGenerateToken}
          title="Generar / Rotar Token Secreto"
          className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#FF9830]/40 bg-[#FF9830]/10 text-[#FF9830] hover:bg-[#FF9830]/20 transition-colors text-[11px] font-semibold"
        >
          <Key className="h-3 w-3" />
          <span className="hidden sm:inline">Secret Token</span>
        </button>

        <Button
          variant="glow"
          size="sm"
          onClick={onOpenCreateModal}
          className="text-xs h-7 px-2.5 rounded bg-[#5794F2] hover:bg-[#437fd6] text-black font-bold shadow-none"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Host</span>
        </Button>

        <button
          type="button"
          onClick={onLogout}
          title="Cerrar Sesión"
          className="p-1.5 rounded border border-[#2e323b] bg-[#181b1f] text-[#686f7c] hover:text-[#F2495C] hover:bg-[#F2495C]/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
