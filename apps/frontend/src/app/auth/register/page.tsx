"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import { useState } from "react";
import { authService } from "@/services/auth/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authService.register({
      name,
      lastName,
      email,
      password,
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-[110px]" />

      <Card
        className="w-full max-w-lg shadow-2xl relative z-10"
        title="Crear cuenta"
        description="Empieza a guardar tus archivos de forma segura hoy mismo"
      >
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="Nombre"
            placeholder="Wandy"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Apellido"
            placeholder="Cruz"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Correo electrónico"
              placeholder="nombre@ejemplo.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Input
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirmar contraseña"
            placeholder="••••••••"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="md:col-span-2 pt-2">
            <Button className="w-full tracking-wide font-bold">
              Crear mi cuenta
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground pt-2">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </Card>
    </main>
  );
}
