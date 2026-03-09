"use client";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

      <Card
        className="w-full max-w-md shadow-2xl relative z-10"
        title="Bienvenido de nuevo"
        description="Ingresa tus credenciales para acceder a tu nube"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Correo electrónico"
            placeholder="nombre@ejemplo.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between px-1">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button className="w-full mt-2 tracking-wide font-bold">
            Iniciar Sesión
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Regístrate ahora
          </Link>
        </p>
      </Card>
    </main>
  );
}
