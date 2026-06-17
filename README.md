# David's Bakery — Bakery Management System

A full-stack web application for managing a real bakery business. Built as a portfolio project to demonstrate end-to-end software development: REST API design, relational database modeling, authentication, CI/CD, and cloud deployment.

**Live demo:** [www.davisbakery.store](https://www.davisbakery.store)

---

## What it does

David's Bakery replaces spreadsheets and paper notebooks for a small bakery. The owner can:

- Register customers and track their order history
- Create orders with delivery dates, product descriptions, and reference images
- Record partial payments (advances, installments, final balance) and track outstanding debt
- Manage ingredient inventory with stock alerts
- Log income and expenses and view a monthly financial summary
- Print a formatted order ticket (comanda) for each order
- Receive email password-reset links via Gmail SMTP

---

## Architecture

The system is split into three independently deployed services:

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                   │
│           React 18 + TypeScript + Vite              │
│         Azure Static Web Apps (Free tier)           │
│              www.davisbakery.store                  │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / JWT
          ┌──────────┴──────────┐
          │                     │
┌─────────▼──────────┐ ┌───────▼─────────────┐
│   Bakerys.API       │ │  Bakerys.Seguridad   │
│  Business REST API  │ │  Auth & Recovery API │
│  ASP.NET Core 8     │ │  ASP.NET Core 8      │
│  Azure App Service  │ │  Azure App Service   │
│  B1 Linux           │ │  B1 Linux            │
└─────────┬──────────┘ └───────┬─────────────┘
          │                     │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │    Azure SQL DB      │
          │  sql-davids-bakery   │
          │  Basic tier          │
          │  12 tables, 36 SPs   │
          └─────────────────────┘
```

### Why two APIs?

Authentication concerns are completely isolated from business logic. `Bakerys.Seguridad` handles JWT issuance, user registration, and password recovery. `Bakerys.API` trusts the token and focuses entirely on the bakery domain.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + TypeScript | Component model, type safety |
| Build tool | Vite | Fast HMR, optimized production bundles |
| Styling | TailwindCSS + inline CSS | Utility-first for layout, custom for print |
| Animations | Framer Motion | Smooth page transitions |
| HTTP client | Axios | Interceptors for JWT injection and 401 handling |
| Routing | React Router v6 | Client-side SPA routing |
| Business API | ASP.NET Core 8 | Mature, performant, strong typing |
| Data access | Dapper | Thin micro-ORM, full control over SQL |
| Auth API | ASP.NET Core 8 + JWT | Stateless auth, short-lived tokens |
| Email | Gmail SMTP (MailKit) | Password recovery emails |
| Database | SQL Server (Azure SQL) | Relational integrity, stored procedures |
| CI/CD | GitHub Actions | Automated build and deploy on every push to main |
| Hosting | Azure (App Service + Static Web Apps) | Production-grade, free/low-cost tiers |
| Domain | Namecheap → CNAME → Azure | Custom domain with auto-provisioned SSL |

---

## Project Structure

```
david-s-bakery/
├── Bakerys.API/                  # Business REST API
│   ├── Abstracciones/            # Models and interfaces (contracts)
│   │   ├── Interfaces/API/       # Controller interfaces
│   │   ├── Interfaces/DA/        # Data access interfaces
│   │   ├── Interfaces/Flujo/     # Business logic interfaces
│   │   └── Modelos/              # Request/response models
│   ├── DA/                       # Data access — Dapper + Stored Procedures
│   ├── Flujo/                    # Business logic layer
│   ├── API/                      # Controllers + Program.cs
│   └── DB/                       # SQL schema (tables, views, SPs)
│
├── Bakerys.Seguridad/            # Auth & recovery API (same layer structure)
│
├── Bakerys.React/                # Frontend SPA
│   ├── src/
│   │   ├── pages/                # Route-level components
│   │   │   ├── auth/             # Login, Register, Forgot/Reset password
│   │   │   ├── clientes/         # Customer CRUD
│   │   │   ├── pedidos/          # Orders + Comanda print view
│   │   │   ├── pagos/            # Payments
│   │   │   ├── inventario/       # Inventory + movements
│   │   │   ├── finanzas/         # Transactions + financial summary
│   │   │   └── Dashboard.tsx     # Home with KPIs and charts
│   │   ├── services/             # Axios service layer (one file per domain)
│   │   ├── types/                # TypeScript interfaces
│   │   └── components/           # Shared UI components
│   ├── public/
│   │   └── staticwebapp.config.json  # SPA routing + MIME types for Azure
│   ├── .env                      # Local dev URLs
│   └── .env.production           # Azure production URLs
│
└── .github/workflows/
    ├── deploy-api.yml            # Build + deploy Bakerys.API on push to main
    ├── deploy-seguridad.yml      # Build + deploy Bakerys.Seguridad on push to main
    └── azure-static-web-apps-*.yml  # Build React + deploy to Static Web Apps
```

---

## Backend Design

### Clean Architecture (4 layers)

Every domain module follows the same layered pattern:

```
Controller (API layer)
    └── IFlujo interface
            └── Flujo (business logic)
                    └── IDA interface
                            └── DA (Dapper queries → Stored Procedures → SQL Server)
```

Each layer depends only on the layer below it through an interface. This makes every piece independently testable and swappable.

### Stored Procedures

All database operations go through stored procedures — no raw SQL strings in C# code. This enforces business rules at the database level and prevents SQL injection by design.

Example business rules enforced in SPs:
- Cannot register a payment larger than the outstanding balance
- Cannot add a stock exit if current stock < requested quantity
- Deactivating a customer with active orders raises an error

### JWT Authentication

`Bakerys.Seguridad` issues a signed JWT on login. Every request to `Bakerys.API` must include it as a Bearer token. The React frontend injects the token automatically via an Axios request interceptor, and redirects to `/login` on any 401 response.

---

## Database

**12 tables · 1 view · 36 stored procedures**

```
Usuarios          — system users (Seguridad API)
TokensRecuperacion — password reset tokens with expiry

Clientes          — customers
Pedidos           — orders (status, delivery date, total, balance)
DetallesPedido    — line items per order (flavor, size, decoration)
Pagos             — partial payments linked to orders

Productos         — inventory items with stock levels
MovimientosInventario — stock entries and exits

Transacciones     — income and expense records

EstadosPedido     — order status catalog
VistaPedidosResumen — denormalized view joining orders + customer + payments
```

---

## API Endpoints

### Bakerys.API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Cliente` | List all customers |
| GET | `/api/Cliente/{id}` | Get customer by ID |
| GET | `/api/Cliente/buscar?busqueda=` | Search by name or phone |
| POST | `/api/Cliente` | Create customer |
| PUT | `/api/Cliente/{id}` | Update customer |
| DELETE | `/api/Cliente/{id}` | Deactivate customer |
| GET | `/api/Pedido` | List all orders |
| GET | `/api/Pedido/{id}` | Get order with line items and payments |
| POST | `/api/Pedido` | Create order |
| POST | `/api/Pedido/detalle` | Add line item to order |
| PUT | `/api/Pedido/{id}/estado` | Update order status |
| PUT | `/api/Pedido/{id}/cancelar` | Cancel order |
| POST | `/api/Pago` | Register payment |
| GET | `/api/Pago/pedido/{id}` | Payments for an order |
| GET | `/api/Pago/pedido/{id}/saldo` | Outstanding balance |
| GET | `/api/Producto` | List products (filters: category, active, low stock) |
| POST | `/api/Producto` | Add product |
| PUT | `/api/Producto/{id}` | Update product |
| POST | `/api/MovimientoInventario` | Register stock entry or exit |
| GET | `/api/Transaccion` | List transactions (filters: type, category, date range) |
| GET | `/api/Transaccion/resumen` | Monthly financial summary |
| POST | `/api/Transaccion` | Record income or expense |

### Bakerys.Seguridad

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/Autenticacion/login` | Login — returns JWT |
| POST | `/api/Usuario/registrar` | Register new user (requires invite code) |
| POST | `/api/Recuperacion/solicitar` | Send password reset email |
| GET | `/api/Recuperacion/validar?token=` | Validate reset token |
| POST | `/api/Recuperacion/restablecer` | Reset password |

---

## CI/CD Pipeline

Three GitHub Actions workflows run on every push to `main`:

```
Push to main
    ├── deploy-api.yml
    │       dotnet restore → build → publish → azure/webapps-deploy
    │
    ├── deploy-seguridad.yml
    │       dotnet restore → build → publish → azure/webapps-deploy
    │
    └── azure-static-web-apps-*.yml
            setup-node → npm ci → npm run build (Vite)
            → Azure/static-web-apps-deploy (uploads ./dist)
```

Publish profiles are stored as GitHub repository secrets. No credentials exist in code.

---

## Frontend Features

- **Dashboard** — live KPIs (active orders, pending payments, low stock alerts, monthly revenue) with sparkline charts and a bar chart built with inline SVG
- **Orders** — full CRUD with status workflow (Pending → In Progress → Ready → Delivered / Cancelled)
- **Comanda** — printable order ticket at `/pedidos/:id/comanda`, styled for A4 paper with `@page` CSS rules
- **Customers** — searchable list with inline deactivation
- **Inventory** — product list with stock level indicators and movement history
- **Finances** — income/expense log with monthly totals
- **Auth flows** — login, registration (invite code required), forgot password, reset password via email link
- **SPA routing** — `staticwebapp.config.json` navigation fallback ensures direct URLs and page refreshes work on Azure

---

## Running Locally

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- SQL Server (local or Azure)

### 1. Database
Run `migration_tablas.sql` then `migration_sps.sql` against your SQL Server instance.

### 2. Bakerys.API
```bash
cd Bakerys.API/API
# set connection string in appsettings.Development.json
dotnet run
# runs on https://localhost:7020
```

### 3. Bakerys.Seguridad
```bash
cd Bakerys.Seguridad/API
# set connection string, JWT key, Gmail credentials in appsettings.Development.json
dotnet run
# runs on https://localhost:7092
```

### 4. Bakerys.React
```bash
cd Bakerys.React
npm install
npm run dev
# runs on http://localhost:5173
```

`.env` already points to the local API ports.

---

## Deployment (Azure)

| Resource | Service | Tier |
|----------|---------|------|
| React frontend | Azure Static Web Apps | Free |
| Business API | Azure App Service (Linux) | B1 |
| Auth API | Azure App Service (Linux) | B1 |
| Database | Azure SQL Database | Basic |

SSL certificate for `www.davisbakery.store` is auto-provisioned by Azure Static Web Apps.

---

## Author

**Sebastián González Rojas** — Computer Engineering student  
[GitHub](https://github.com/Sebasgonzalez26)
