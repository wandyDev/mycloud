"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import { useState } from "react";
import { authService } from "@/services/auth/auth";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, User, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.register({
        name,
        lastName,
        email,
        password,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("secretToken", response.secretToken);
      }
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: string })?.message;
        setError(message || "No se pudo registrar la cuenta");
      } else {
        setError("Error de conexión con el servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#080c14] text-slate-100 gradient-mesh">
      {/* Glow Effects */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-lg mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-10 w-10 mx-auto rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Crear Cuenta de Monitoreo
          </h1>
          <p className="text-xs text-slate-400">
            Registra tu usuario para obtener credenciales de telemetría y gestionar tus servidores
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Nombre"
                placeholder="Wandy"
                required
                leftIcon={<User className="h-4 w-4" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Apellido"
                placeholder="Cruz"
                required
                leftIcon={<User className="h-4 w-4" />}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              label="Correo Electrónico"
              placeholder="tu@correo.com"
              type="email"
              required
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Contraseña"
                placeholder="••••••••"
                type="password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Confirmar Contraseña"
                placeholder="••••••••"
                type="password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 text-[11px] text-sky-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
              <span>Se generará automáticamente tu Secret Token cifrado para agentes.</span>
            </div>

            <Button
              variant="glow"
              className="w-full mt-2 font-semibold text-sm h-11"
              isLoading={isLoading}
            >
              Crear Cuenta & Empezar
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800/80">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="text-sky-400 font-semibold hover:underline underline-offset-4 hover:text-sky-300"
            >
              Inicia sesión
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
