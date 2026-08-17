# ⚡ MyCloud — Real-Time Server Telemetry & Cloud Infrastructure Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.IO-4.x-black?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)

> **Plataforma distribuida de monitoreo de servidores e infraestructura en tiempo real** construida bajo una arquitectura monorepo de alto rendimiento con **Turborepo**, **NestJS**, **WebSockets bidireccionales**, **Next.js (App Router)** y **PostgreSQL**.

---

## 📌 Tabla de Contenidos
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Características Principales](#-características-principales)
- [Estructura del Monorepo](#-estructura-del-monorepo)
- [Pila Tecnológica](#-pila-tecnológica)
- [Flujo de Autenticación y Telemetría](#-flujo-de-autenticación-y-telemetría)
- [Guía de Instalación y Uso Local](#-guía-de-instalación-y-uso-local)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts del Proyecto](#-scripts-del-proyecto)

---

## 🏗 Arquitectura del Sistema

El sistema utiliza una arquitectura desacoplada con **Namespaces aislados de Socket.IO** para garantizar que los agentes de telemetría de hardware nunca tengan acceso directo a los canales de los clientes web:

```mermaid
flowchart TD
    subgraph Host["🖥️ Nodo / Servidor Remoto"]
        Agent["🤖 Agent Bot (TypeScript)<br>os.loadavg(), os.freemem(), uptime"]
    end

    subgraph Backend["⚙️ Backend (NestJS + Prisma)"]
        AgentGW["🔌 Agent Gateway (/agent)<br>Valida ServerID + ServerKey + SecretToken (bcrypt)"]
        ClientGW["🌐 Client Gateway (/client)<br>Valida Ticket Efímero de 1 Solo Uso"]
        AuthSvc["🔐 Auth & Ticket Service"]
        DB[("🐘 PostgreSQL (Prisma ORM)<br>Users, Servers, Hashes")]
        
        AgentGW -->|Cross-Gateway Event| ClientGW
        AgentGW -.->|Verificación DB| DB
        ClientGW -.->|Valida & Quema Ticket| DB
        AuthSvc -.->|Genera JWT & Tickets| DB
    end

    subgraph Frontend["💻 Frontend (Next.js 16 + Tailwind CSS)"]
        Dashboard["📊 Real-Time Dashboard<br>CPU Gauge, RAM Usage, Live Feed"]
    end

    Agent -->|1. findMetrics payload (cada 30s)| AgentGW
    Dashboard -->|POST /api/v1/auth/ticket| AuthSvc
    Dashboard -->|2. Conexión WebSocket con Ticket| ClientGW
    ClientGW -->|3. metrics event (en vivo)| Dashboard
```

---

## 🌟 Características Principales

- **⚡ Streaming de Telemetría en Tiempo Real**: Recepción continua de carga de CPU, núcleos detectados, memoria RAM usada/total y tiempo de actividad del sistema vía WebSockets.
- **🛡️ Seguridad con Tickets Efímeros**: Los clientes web generan un ticket criptográfico de un solo uso para conectarse al canal `/client`. Una vez consumido, el ticket es invalidado en la base de datos para prevenir secuestros de sesión.
- **🔑 Autenticación Multi-Factor para Agentes**: Cada servidor conectado requiere validación dual: `SecretToken` del usuario (hasheado con bcrypt) + `ServerKey` única.
- **🎨 Dashboard Moderno con Glassmorphism**: Interfaz oscura con paleta moderna, indicadores en vivo (*pulsing indicators*), medidores de consumo dinámicos y línea temporal de eventos de hardware.
- **🤖 Agente Autónomo y Ligero**: Script modular en TypeScript ejecutable en segundo plano en cualquier servidor Linux, macOS o Windows sin impacto de rendimiento.
- **📦 Monorepo Tipado de Extremo a Extremo**: Paquetes compartidos (`@my_cloud/types`) que garantizan consistencia en los contratos de datos entre Agent, Backend y Frontend.

---

## 📁 Estructura del Monorepo

```text
mycloud/
├── apps/
│   ├── backend/          # API REST & WebSocket Gateways en NestJS (v11)
│   │   ├── prisma/       # Esquema y migraciones de base de datos
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/     # JWT Auth, registro, login y generación de tickets
│   │       │   ├── servers/  # CRUD de servidores y gestión de claves
│   │       │   └── socket/   # Gateways (/agent y /client) y servicios
│   │       └── database/     # Prisma client provider
│   │
│   ├── frontend/         # Dashboard interactivo en Next.js 16 (App Router)
│   │   └── src/
│   │       ├── app/          # Rutas: Landing (/), Login, Register, Dashboard
│   │       ├── components/   # UI Primitives & Dashboard Widgets
│   │       ├── services/     # Clientes HTTP (Axios)
│   │       └── socket/       # Cliente WebSocket (Socket.IO client)
│   │
│   └── agent/            # Daemon de recolección de métricas del host (OS module)
│       ├── modules/metrics/  # Cálculo de carga de CPU, RAM y Uptime
│       └── main.ts           # Bucle de envío periódico
│
├── packages/
│   ├── types/            # DTOs y payloads de telemetría compartidos
│   ├── eslint-config/    # Reglas de linter unificadas
│   ├── typescript-config/# Configuraciones base de tsconfig.json
│   └── ui/               # Componentes UI reutilizables
│
├── package.json          # Configuración raíz de pnpm workspaces
└── turbo.json            # Pipeline de ejecución paralela y caché con Turborepo
```

---

## 💻 Pila Tecnológica

| Capa | Tecnologías |
|---|---|
| **Monorepo & Build** | Turborepo, pnpm Workspaces |
| **Backend** | NestJS 11, Node.js, TypeScript, Passport.js (JWT), bcrypt |
| **Tiempo Real** | Socket.IO (Namespaces `/agent` y `/client`), WebSockets |
| **Base de Datos** | PostgreSQL, Prisma ORM |
| **Frontend** | Next.js 16 (Turbopack), React 19, Tailwind CSS v4, Lucide Icons |
| **Agente Host** | Node.js OS Module, Socket.IO Client, TSX |

---

## 🚀 Guía de Instalación y Uso Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/mycloud.git
cd mycloud
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Cada aplicación incluye un archivo `.env.example` como plantilla. Crea los archivos `.env` correspondientes:
 
#### Backend (`apps/backend/.env`):
```bash
cp apps/backend/.env.example apps/backend/.env
```
Configura la conexión a tu base de datos PostgreSQL local o remota:
```env
PORT=3007
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/TU_BASE_DATOS?schema=public"
JWT_SECRET="tu_jwt_secret_personalizado"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
COOKIE_SECURE=false
```

#### Frontend (`apps/frontend/.env.local`):
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```
```env
NEXT_PUBLIC_API_URL=http://localhost:3007/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3007
```

#### Agente (`apps/agent/.env`):
```bash
cp apps/agent/.env.example apps/agent/.env
```
> 💡 *Puedes copiar la configuración lista directamente desde el Dashboard web al registrar un servidor:*
```env
SECRET_TOKEN="tu_secret_token_obtenido_en_dashboard"
API_URL=http://localhost:3007/agent
SERVER_ID="tu_server_id_generado"
SERVER_KEY="tu_server_key_generada"
```

### 4. Ejecutar Migraciones de Base de Datos
Una vez configurado tu `DATABASE_URL` en `apps/backend/.env`:
```bash
cd apps/backend
npx prisma db push
cd ../..
```

### 5. Iniciar en Modo Desarrollo
En la raíz del proyecto:
```bash
# Inicia Frontend y Backend simultáneamente con Turborepo
pnpm run dev
```

En otra terminal, inicia el Agente de telemetría:
```bash
# Inicia el agente host recolector de métricas
cd apps/agent
pnpm run start@bot
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 📋 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `pnpm run dev` | Inicia el frontend y backend en modo desarrollo |
| `pnpm run build` | Compila todos los paquetes y aplicaciones del monorepo |
| `pnpm run start@bot` | Inicia el agente de telemetría de servidor |
| `pnpm run lint` | Ejecuta el linter ESLint en todo el workspace |

---

## 👨‍💻 Autor

- **Wandy Cruz** — [LinkedIn](https://linkedin.com) · [GitHub](https://github.com)
- Proyecto desarrollado como demostración técnica de arquitectura distribuida, WebSockets y monorepos modernos.
