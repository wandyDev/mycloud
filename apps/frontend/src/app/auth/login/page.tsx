"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth";
import { Activity, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string })?.message;
        setError(message || "Credenciales inválidas");
      } else {
        setError("No se pudo conectar al servidor de autenticación");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#080c14] text-slate-100 gradient-mesh">
      {/* Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-10 w-10 mx-auto rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Iniciar Sesión en MyCloud
          </h1>
          <p className="text-xs text-slate-400">
            Accede al panel de monitoreo y telemetría de tus servidores
          </p>
        </div>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/80">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Correo Electrónico"
              placeholder="admin@empresa.com"
              type="email"
              required
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              type="password"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="glow"
              className="w-full mt-3 font-semibold text-sm h-11"
              isLoading={isLoading}
            >
              Entrar al Panel
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800/80">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-sky-400 font-semibold hover:underline underline-offset-4 hover:text-sky-300"
            >
              Regístrate gratis
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
