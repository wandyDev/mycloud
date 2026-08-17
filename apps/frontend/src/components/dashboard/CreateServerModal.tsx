"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { metricasService } from "@/services/metricas/metricas";
import { Server, Copy, Check, X, ShieldCheck, Terminal, AlertCircle } from "lucide-react";
import axios from "axios";

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServerCreated: () => void;
  userSecretToken?: string;
}

export default function CreateServerModal({
  isOpen,
  onClose,
  onServerCreated,
  userSecretToken = "",
}: CreateServerModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [createdData, setCreatedData] = useState<{
    serverId: string;
    serverKey: string;
    name: string;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await metricasService.createServer({
        name,
        description,
      });

      setCreatedData({
        serverId: res.serverId,
        serverKey: res.serverKey,
        name,
      });
      onServerCreated();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message;
        setError(msg || "No se pudo registrar el servidor");
      } else {
        setError("Error de conexión al registrar el servidor");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setError(null);
    setCreatedData(null);
    onClose();
  };

  const envSnippet = createdData
    ? `SECRET_TOKEN=${userSecretToken || "tu_secret_token_aqui"}
API_URL=http://localhost:3007/agent
SERVER_ID=${createdData.serverId}
SERVER_KEY=${createdData.serverKey}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-black/80 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {createdData ? "¡Servidor Registrado!" : "Conectar Nuevo Servidor"}
              </h3>
              <p className="text-xs text-slate-400">
                {createdData
                  ? "Configura las credenciales en tu agente de telemetría"
                  : "Crea una instancia para monitoreo de métricas en tiempo real"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!createdData ? (
          /* Form view */
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre del Servidor"
              placeholder="p. ej. Servidor Producción US-East"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              helperText="Identificador legible para tu servidor o droplet"
            />

            <Input
              label="Descripción"
              placeholder="p. ej. Servidor API Linux Ubuntu 22.04"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              helperText="Detalles sobre el rol o entorno"
            />

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="glow" isLoading={isSubmitting}>
                Crear Servidor
              </Button>
            </div>
          </form>
        ) : (
          /* Result view */
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200">
                  Credenciales de Agente Generadas
                </p>
                <p className="text-emerald-300/80 text-[11px] mt-0.5">
                  Copia estas claves a tu archivo <code className="text-white bg-black/40 px-1 py-0.5 rounded">.env</code> del agente para iniciar el envío de telemetría.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {!userSecretToken && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  <p className="font-semibold">⚠️ Token secreto no detectado en este navegador</p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">
                    Puedes generar un nuevo Secret Token para tu usuario desde el panel principal en la sección de Conectar Agente.
                  </p>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  SERVER ID
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={createdData.serverId}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(createdData.serverId, "serverId")}
                  >
                    {copiedField === "serverId" ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  SERVER KEY
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={createdData.serverKey}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(createdData.serverKey, "serverKey")}
                  >
                    {copiedField === "serverKey" ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-sky-400" />
                    <span>Configuración completa (.env del Agent)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(envSnippet, "env")}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                  >
                    {copiedField === "env" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar Todo</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {envSnippet}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="glow" onClick={handleClose}>
                Listo, volver al panel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
