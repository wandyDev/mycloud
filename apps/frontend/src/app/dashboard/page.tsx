"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import { authService } from "@/services/auth/auth";
import { metricasService } from "@/services/metricas/metricas";
import { socketService } from "@/socket/socket";
import type { AgentPayload, ServerRecord } from "@/types/backend";

// Grafana Dashboard Components
import GrafanaStatTile from "@/components/dashboard/GrafanaStatTile";
import GrafanaSegmentedGauge from "@/components/dashboard/GrafanaSegmentedGauge";
import GrafanaResourceTable, { ResourceRow } from "@/components/dashboard/GrafanaResourceTable";
import GrafanaTimeSeriesChart, { SeriesData } from "@/components/dashboard/GrafanaTimeSeriesChart";
import GrafanaFilterHeader from "@/components/dashboard/GrafanaFilterHeader";
import CreateServerModal from "@/components/dashboard/CreateServerModal";
import TelemetryStream from "@/components/dashboard/TelemetryStream";

// Icons
import {
  Server,
  Plus,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Activity,
  Layers,
} from "lucide-react";
import Button from "@/components/ui/button";

export default function DashboardPage() {
  const [servers, setServers] = useState<ServerRecord[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [metricsByServer, setMetricsByServer] = useState<Record<string, AgentPayload[]>>({});

  // Socket & UI State
  const [socketStatus, setSocketStatus] = useState<
    "connected" | "connecting" | "disconnected" | "error"
  >("connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const disconnectRef = useRef<null | (() => void)>(null);

  // Retrieve user secretToken from localStorage if available
  const [userSecretToken, setUserSecretToken] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserSecretToken(localStorage.getItem("secretToken") || "");
    }
  }, []);

  // Selected server reference
  const selectedServer = useMemo(
    () => servers.find((s) => s.serverId === selectedServerId) ?? null,
    [servers, selectedServerId],
  );

  // Selected metrics history
  const selectedMetrics = useMemo(
    () => (selectedServerId ? metricsByServer[selectedServerId] ?? [] : []),
    [selectedServerId, metricsByServer],
  );

  // Latest metric record
  const latestMetric = useMemo(() => {
    return selectedMetrics[0] ?? null;
  }, [selectedMetrics]);

  // Handle server list loading
  const loadServers = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const serverList = await metricasService.getServers();
      setServers(serverList);
      setSelectedServerId((current) => {
        if (current && serverList.some((s) => s.serverId === current)) {
          return current;
        }
        return serverList[0]?.serverId ?? null;
      });
      setErrorMessage(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message;
        setErrorMessage(msg || "No se pudo sincronizar la lista de servidores");
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Automated WebSocket connection lifecycle
  const initWebSocket = useCallback(async () => {
    try {
      setSocketStatus("connecting");
      const ticketRes = await authService.generateTicket();

      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }

      const disconnect = socketService.connectToClientChannel(
        ticketRes.ticket,
        (payload: AgentPayload) => {
          setMetricsByServer((prev) => {
            const list = prev[payload.serverId] ?? [];
            return {
              ...prev,
              [payload.serverId]: [payload, ...list].slice(0, 50),
            };
          });
        },
        () => {
          setSocketStatus("connected");
          setErrorMessage(null);
        },
        (err) => {
          console.error("Socket connection error:", err);
          setSocketStatus("error");
        },
        () => {
          setSocketStatus("disconnected");
        },
      );

      disconnectRef.current = disconnect;
    } catch (err) {
      console.error("Failed to initialize WebSocket ticket:", err);
      setSocketStatus("error");
    }
  }, []);

  // Initial Load
  useEffect(() => {
    void loadServers();
    void initWebSocket();

    return () => {
      if (disconnectRef.current) {
        disconnectRef.current();
      }
    };
  }, [loadServers, initWebSocket]);

  // Helper for copy
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  // Helper to generate / rotate secret token
  const handleGenerateSecretToken = async () => {
    try {
      const res = await authService.generateSecretToken();
      setUserSecretToken(res.secretToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("secretToken", res.secretToken);
      }
    } catch (e) {
      console.error("Error generando secret token:", e);
    }
  };

  // Logout handler
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

  // Metric Computations
  const cpuPercent = useMemo(() => {
    if (!latestMetric) return 0;
    const raw = String(latestMetric.metrics.cpuLoad).replace("%", "").trim();
    return parseFloat(raw) || 0;
  }, [latestMetric]);

  const ramUsedNum = useMemo(() => {
    if (!latestMetric) return 0;
    const usedRaw = String(latestMetric.metrics.ramUsed).replace("GB", "").trim();
    return parseFloat(usedRaw) || 0;
  }, [latestMetric]);

  const ramTotalNum = useMemo(() => {
    if (!latestMetric) return 0;
    const totalRaw = String(latestMetric.metrics.ramTotal).replace("GB", "").trim();
    return parseFloat(totalRaw) || 0;
  }, [latestMetric]);

  const ramPercent = useMemo(() => {
    if (!latestMetric || ramTotalNum === 0) return 0;
    return (ramUsedNum / ramTotalNum) * 100;
  }, [latestMetric, ramUsedNum, ramTotalNum]);

  const formattedUptime = useMemo(() => {
    if (!latestMetric) return "0.0s";
    const raw = String(latestMetric.metrics.uptime).replace("segundos", "").trim();
    const seconds = parseFloat(raw);
    if (isNaN(seconds)) return String(latestMetric.metrics.uptime);

    const weeks = Math.floor(seconds / (3600 * 24 * 7));
    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (weeks > 0) return `${(seconds / (3600 * 24 * 7)).toFixed(1)} week`;
    if (days > 0) return `${days}d ${hrs % 24}h`;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m`;
    return `${seconds.toFixed(0)}s`;
  }, [latestMetric]);

  // Chart Series Data (Chronological order)
  const cpuSeries: SeriesData[] = useMemo(() => {
    const sorted = [...selectedMetrics].reverse();
    return [
      {
        name: "CPU Load (%)",
        color: "#5794F2", // Grafana Blue
        unit: "%",
        data: sorted.map((m) => ({
          timestamp: m.timestamp,
          value: parseFloat(String(m.metrics.cpuLoad).replace("%", "")) || 0,
        })),
      },
      {
        name: "CPU Core Load (Ratio)",
        color: "#FF9830", // Grafana Amber
        unit: "%",
        data: sorted.map((m) => ({
          timestamp: m.timestamp,
          value:
            (parseFloat(String(m.metrics.cpuLoad).replace("%", "")) || 0) /
            (m.metrics.cpuCore || 1),
        })),
      },
    ];
  }, [selectedMetrics]);

  const ramSeries: SeriesData[] = useMemo(() => {
    const sorted = [...selectedMetrics].reverse();
    return [
      {
        name: "Used RAM Memory",
        color: "#73BF69", // Grafana Green
        unit: "GB",
        data: sorted.map((m) => ({
          timestamp: m.timestamp,
          value: parseFloat(String(m.metrics.ramUsed).replace("GB", "")) || 0,
        })),
      },
      {
        name: "Total Memory Limit",
        color: "#F2495C", // Grafana Red
        unit: "GB",
        data: sorted.map((m) => ({
          timestamp: m.timestamp,
          value: parseFloat(String(m.metrics.ramTotal).replace("GB", "")) || 0,
        })),
      },
    ];
  }, [selectedMetrics]);

  // Resource Table Breakdown Rows
  const tableRows: ResourceRow[] = useMemo(() => {
    if (!latestMetric || !selectedServer) return [];
    const ramFree = Math.max(0, ramTotalNum - ramUsedNum);

    return [
      {
        resource: "System RAM Memory",
        target: selectedServer.serverId,
        role: "Physical RAM (DDR)",
        totalSize: `${ramTotalNum.toFixed(2)} GB`,
        available: `${ramFree.toFixed(2)} GB`,
        usedPercentage: ramPercent,
      },
      {
        resource: "Processor Subsystem",
        target: `${latestMetric.metrics.cpuCore || 1} Cores`,
        role: "Load Average (1m)",
        totalSize: "100.00 %",
        available: `${Math.max(0, 100 - cpuPercent).toFixed(2)} %`,
        usedPercentage: cpuPercent,
      },
      {
        resource: "Host Uptime & Heartbeat",
        target: selectedServer.name,
        role: "Telemetry Daemon",
        totalSize: "100.00 %",
        available: "Active",
        usedPercentage: 100,
      },
    ];
  }, [latestMetric, selectedServer, ramTotalNum, ramUsedNum, ramPercent, cpuPercent]);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#d8d9da] flex flex-col font-sans selection:bg-[#5794F2]/30 selection:text-white">
      {/* Grafana Top Filter Toolbar */}
      <GrafanaFilterHeader
        servers={servers}
        selectedServerId={selectedServerId}
        onSelectServer={setSelectedServerId}
        socketStatus={socketStatus}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefreshServers={loadServers}
        onGenerateToken={handleGenerateSecretToken}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
      />

      {/* Main Grafana Dashboard Content Area */}
      <main className="flex-1 p-3 sm:p-4 space-y-3 max-w-[1700px] w-full mx-auto">
        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-center justify-between p-3 rounded border border-[#F2495C]/40 bg-[#F2495C]/10 text-[#F2495C] text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={initWebSocket}
              className="text-[11px] h-6 px-2 border-[#F2495C]/50 text-[#F2495C]"
            >
              Reconectar Socket
            </Button>
          </div>
        )}

        {/* Empty State when no server registered */}
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-md border border-[#22252b] bg-[#141619] text-center space-y-4">
            <div className="p-4 rounded-md bg-[#5794F2]/10 text-[#5794F2] border border-[#5794F2]/20">
              <Server className="h-8 w-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-sm font-bold font-mono text-white">
                NO HOST NODES CONNECTED
              </h3>
              <p className="text-xs text-[#8e8e8e] leading-relaxed">
                Registra tu primer servidor para generar el identificador de nodo y comenzar a transmitir métricas en tiempo real mediante WebSockets.
              </p>
            </div>
            <Button
              variant="glow"
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs h-8 px-4 rounded bg-[#5794F2] text-black font-bold"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Nuevo Host</span>
            </Button>
          </div>
        ) : (
          selectedServer && (
            <div className="space-y-3">
              {/* TOP ROW: Stat Tiles + Segmented Gauges + Resource Table (Inspired by Screenshot) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
                {/* 4 Stat Big Number Tiles (lg: 4 cols) */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                  <GrafanaStatTile
                    label="System Uptime"
                    value={formattedUptime}
                    color="green"
                    sublabel="Continuous Operation"
                  />
                  <GrafanaStatTile
                    label="Total RAM"
                    value={latestMetric ? String(latestMetric.metrics.ramTotal) : "-- GB"}
                    color="cyan"
                    sublabel="Memory Capacity"
                  />
                  <GrafanaStatTile
                    label="CPU Cores"
                    value={latestMetric?.metrics.cpuCore ? `${latestMetric.metrics.cpuCore}` : "--"}
                    color="green"
                    sublabel="Logical Processors"
                  />
                  <GrafanaStatTile
                    label="CPU Load"
                    value={latestMetric ? String(latestMetric.metrics.cpuLoad) : "0.00%"}
                    color={cpuPercent > 70 ? "rose" : cpuPercent > 40 ? "amber" : "green"}
                    sublabel="Average Load (1m)"
                  />
                </div>

                {/* Segmented Bar Gauges (lg: 3 cols) */}
                <div className="lg:col-span-3 flex flex-col justify-between gap-2">
                  <GrafanaSegmentedGauge
                    label="CPU Busy"
                    percentage={cpuPercent}
                  />
                  <GrafanaSegmentedGauge
                    label="Used RAM Memory"
                    percentage={ramPercent}
                  />
                  <GrafanaSegmentedGauge
                    label="Core Allocation Ratio"
                    percentage={
                      latestMetric?.metrics.cpuCore
                        ? (cpuPercent / latestMetric.metrics.cpuCore) * 2
                        : 0
                    }
                  />
                </div>

                {/* Resource Breakdown Table (lg: 5 cols) */}
                <div className="lg:col-span-5 flex flex-col">
                  <GrafanaResourceTable rows={tableRows} className="h-full" />
                </div>
              </div>

              {/* MIDDLE ROW: 2 Time-Series Charts (Side by side like in Grafana) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* System Load Chart */}
                <GrafanaTimeSeriesChart
                  title="System Load (CPU % Over Time)"
                  series={cpuSeries}
                  yMax={100}
                />

                {/* Memory Allocation Chart */}
                <GrafanaTimeSeriesChart
                  title="Memory Allocation (Used vs Total RAM in GB)"
                  series={ramSeries}
                  yMax={Math.max(16, ramTotalNum + 2)}
                />
              </div>

              {/* BOTTOM ROW: Real-time Telemetry Stream Timeline & Node Exporter Config */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Timeline Stream (lg: 8 cols) */}
                <div className="lg:col-span-8 rounded-md border border-[#22252b] bg-[#181b1f] overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-[#22252b] bg-[#141619] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-[#5794F2]" />
                      <span className="text-xs font-semibold text-[#d0d0d0] tracking-wide">
                        Real-Time Socket Stream Timeline
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8e8e8e]">
                      {selectedMetrics.length} samples recorded
                    </span>
                  </div>
                  <div className="p-3">
                    <TelemetryStream metrics={selectedMetrics} />
                  </div>
                </div>

                {/* Agent Node Exporter Config (lg: 4 cols) */}
                <div className="lg:col-span-4 rounded-md border border-[#22252b] bg-[#181b1f] flex flex-col justify-between overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-[#22252b] bg-[#141619] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-[#73BF69]" />
                      <span className="text-xs font-semibold text-[#d0d0d0] tracking-wide">
                        Agent Configuration
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#686f7c]">
                      apps/agent/.env
                    </span>
                  </div>

                  <div className="p-3 space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#a0a0a0]">Host Config Snippet:</span>
                      {!userSecretToken && (
                        <button
                          type="button"
                          onClick={handleGenerateSecretToken}
                          className="text-[10px] text-[#FF9830] hover:underline font-bold"
                        >
                          Generar Token
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <pre className="p-3 bg-[#111317] rounded border border-[#252932] text-[11px] text-[#9098a5] overflow-x-auto leading-relaxed">
{`SECRET_TOKEN=${userSecretToken || "tu_secret_token"}
API_URL=http://localhost:3007/agent
SERVER_ID=${selectedServer.serverId}
SERVER_KEY=${selectedServer.serverKey}`}
                      </pre>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            `SECRET_TOKEN=${userSecretToken || "tu_secret_token"}\nAPI_URL=http://localhost:3007/agent\nSERVER_ID=${selectedServer.serverId}\nSERVER_KEY=${selectedServer.serverKey}`,
                            "envSnippet",
                          )
                        }
                        className="absolute top-2 right-2 p-1 rounded bg-[#1f2329] hover:bg-[#2e343e] text-[#a0a0a0] hover:text-white transition-colors"
                        title="Copiar configuración"
                      >
                        {copiedKey === "envSnippet" ? (
                          <Check className="h-3.5 w-3.5 text-[#73BF69]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#686f7c] block">
                        Launch Telemetry Bot:
                      </span>
                      <div className="p-2 rounded bg-[#111317] border border-[#252932] text-[11px] text-[#73BF69] flex items-center justify-between">
                        <span>pnpm run start@bot</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy("pnpm run start@bot", "cmdCopy")
                          }
                          className="text-[#686f7c] hover:text-white"
                        >
                          {copiedKey === "cmdCopy" ? (
                            <Check className="h-3.5 w-3.5 text-[#73BF69]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Modal for Creating Server */}
      <CreateServerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onServerCreated={loadServers}
        userSecretToken={userSecretToken}
      />
    </div>
  );
}
