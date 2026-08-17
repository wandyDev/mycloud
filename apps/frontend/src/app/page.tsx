"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import {
  Activity,
  Cpu,
  Database,
  Radio,
  Server,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
  Terminal,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 relative overflow-hidden gradient-mesh">
      {/* Background glow meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-10 left-1/4 w-[35rem] h-[35rem] bg-sky-500/20 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">
                MyCloud
              </span>
              <span className="text-[10px] text-sky-400 font-mono block -mt-1 uppercase tracking-wider font-semibold">
                Telemetry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="glow" size="sm" className="text-xs">
                <span>Ir al Panel</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center space-y-8 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
          <span>Telemetría en Vivo mediante WebSockets & NestJS</span>
        </div>

        {/* Title */}
        <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Monitoreo en Tiempo Real para{" "}
            <span className="gradient-text">Tus Servidores</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Plataforma integral de telemetría distribuida. Monitorea carga de CPU, consumo de memoria RAM, disponibilidad y eventos de hardware con latencia ultra baja.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-center w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="glow"
              size="lg"
              className="w-full sm:w-auto text-sm h-12 px-7"
            >
              <span>Explorar Panel en Vivo</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-sm h-12 px-7"
            >
              Crear Cuenta
            </Button>
          </Link>
        </div>

        {/* Visual Preview Box */}
        <div className="w-full max-w-4xl pt-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/70 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  mycloud-agent // live telemetry socket
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
                <span>CONNECTED /client</span>
              </span>
            </div>

            {/* Mock Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>CPU Load</span>
                  <Cpu className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">3.84 %</div>
                <div className="text-[10px] text-emerald-400 mt-1">8 Cores Activos</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>RAM Used</span>
                  <Database className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">6.74 GB</div>
                <div className="text-[10px] text-slate-400 mt-1">de 15.50 GB Total</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Uptime</span>
                  <Radio className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">99.98%</div>
                <div className="text-[10px] text-slate-400 mt-1">Estabilidad 24/7</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Latencia</span>
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">&lt; 5 ms</div>
                <div className="text-[10px] text-emerald-400 mt-1">Socket Directo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Diseñado con Arquitectura de Alto Rendimiento
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Construido con un monorepo moderno en Turborepo, NestJS con WebSockets bidireccionales, y Next.js App Router.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                WebSockets Multi-Namespace
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Canales aislados para <code className="text-sky-300">/agent</code> (ingesta de métricas de servidores) y <code className="text-sky-300">/client</code> (streaming seguro al panel web con tokens efímeros).
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Autenticación & Tickets Efímeros
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokens de un solo uso para conexiones en vivo validados con bcrypt y Passport JWT, garantizando aislamiento entre tenants y servidores.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Agente Ligero y Autónomo
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bot en TypeScript empaquetado para correr en segundo plano en cualquier nodo Linux, Mac o Windows sin sobrecarga en la CPU.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950/80 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MyCloud Telemetry Platform. Creado para Portfolio.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Panel
            </Link>
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">
              Registro
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
