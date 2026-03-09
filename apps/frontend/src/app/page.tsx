import Link from "next/link";
import Button from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-12 relative overflow-hidden">
      {/* Background patterns and glows */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="space-y-6 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] gradient-text pb-2">
          La Nube de Próxima Generación
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground/80 max-w-lg mx-auto leading-relaxed">
          Almacena, comparte y gestiona tus archivos con seguridad de grado
          militar y una interfaz diseñada para expertos.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        <Link href="/auth/register">
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-10 text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Empezar Gratis
          </Button>
        </Link>
        <Link href="/auth/login" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 text-lg border-white/10 hover:border-white/20"
          >
            Iniciar Sesión
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
        {[
          { label: "Seguridad", icon: "🔒", desc: "Cifrado E2E" },
          { label: "Velocidad", icon: "⚡", desc: "Infraestructura SSD" },
          { label: "Colaboración", icon: "👥", desc: "En tiempo real" },
          { label: "Privacidad", icon: "🛡️", desc: "Tus datos son tuyos" },
        ].map((item, i) => (
          <div
            key={i}
            className="glass p-6 rounded-2xl flex flex-col items-center gap-3"
          >
            <span className="text-3xl">{item.icon}</span>
            <div className="text-sm font-bold uppercase tracking-widest text-white/90">
              {item.label}
            </div>
            <div className="text-xs text-muted-foreground">{item.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
