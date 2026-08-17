"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cloud, Activity, Plus, LogOut, RefreshCw, Layers } from "lucide-react";
import Button from "@/components/ui/button";

import { authService } from "@/services/auth/auth";

interface DashboardNavbarProps {
  socketStatus: "connected" | "connecting" | "disconnected" | "error";
  serverCount: number;
  onOpenCreateModal: () => void;
  onRefreshServers: () => void;
  isRefreshing?: boolean;
}

export default function DashboardNavbar({
  socketStatus,
  serverCount,
  onOpenCreateModal,
  onRefreshServers,
  isRefreshing = false,
}: DashboardNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("secretToken");
      window.location.href = "/auth/login";
    }
  };

  const getStatusBadge = () => {
    switch (socketStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shadow-sm shadow-emerald-500/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
            <span>WebSocket Activo</span>
          </div>
        );
      case "connecting":
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>Sincronizando...</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Error de Socket</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span>Desconectado</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">
                MyCloud
              </span>
              <span className="text-[10px] text-sky-400 font-mono block -mt-1 uppercase tracking-wider font-semibold">
                Telemetry
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center ml-6 pl-6 border-l border-slate-800">
            {getStatusBadge()}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-medium">{serverCount}</span>
            <span className="text-slate-500">servidores</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshServers}
            isLoading={isRefreshing}
            className="hidden sm:inline-flex"
            title="Recargar Servidores"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="glow"
            size="sm"
            onClick={onOpenCreateModal}
            className="text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Servidor</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
