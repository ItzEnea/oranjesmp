ranjeSMP
Premium Nederlandse Minecraft SMP server website met volledig CMS admin panel voor het beheren van ranks, nieuws, shop en team.

Run & Operate
pnpm --filter @workspace/api-server run dev — start de API server (poort 8080)
pnpm --filter @workspace/oranjesmp run dev — start de frontend (poort 21934)
pnpm run typecheck — volledige typecheck over alle packages
pnpm --filter @workspace/api-spec run codegen — hergeneer API hooks en Zod schemas vanuit de OpenAPI spec
pnpm --filter @workspace/db run push — push DB schema wijzigingen (alleen dev)
Vereiste env: DATABASE_URL — Postgres connectiestring, SESSION_SECRET — sessie geheim
Stack
pnpm workspaces, Node.js 24, TypeScript 5.9
Frontend: React + Vite + Tailwind CSS + shadcn/ui (wouter routing)
API: Express 5 + express-session (session-based auth)
DB: PostgreSQL + Drizzle ORM
Validatie: Zod (zod/v4), drizzle-zod
API codegen: Orval (vanuit OpenAPI spec)
Build: esbuild (CJS bundle)
Where things live
artifacts/
  oranjesmp/          — React+Vite frontend (public website + admin panel)
    src/
      pages/          — Publieke pagina's (home, ranks, shop, nieuws, contact, over-ons)
      pages/admin/    — Admin panel pagina's (dashboard, ranks, nieuws, shop, team, etc.)
      components/
        layout/       — public-layout.tsx (navbar+footer), admin-layout.tsx (sidebar)
        ui/           — shadcn/ui componenten
  api-server/
    src/
      routes/         — auth, ranks, news, shop, payments, settings, team, admin
      app.ts          — Express app setup + CORS + session
      index.ts        — Server entry point + route registratie
lib/
  db/src/schema/      — Drizzle schema (adminUsers, ranks, news, products, payments, settings, team)
  api-client-react/   — Gegenereerde React Query hooks (Orval codegen)
  api-spec/           — OpenAPI spec (source of truth voor API contract)
attached_assets/      — Logo en achtergrondafbeeldingen

Bron-of-truth bestanden:

DB schema: lib/db/src/schema/index.ts
API contract: lib/api-spec/openapi.yaml
Thema/kleuren: artifacts/oranjesmp/src/index.css
Architecture decisions
Session-based auth — Express-session met bcryptjs wachtwoord hashing. Geen JWT. Sessie cookie wordt meegestuurd via credentials: true CORS.
Contract-first API — OpenAPI spec eerst, daarna Orval codegen voor React Query hooks en Zod schemas. Nooit handmatig hooks schrijven.
Route volgorde kritisch — /ranks/reorder MOET vóór /:id geregistreerd worden, anders matcht Express "reorder" als een ID parameter.
JSONB voor rank features — Rank voordelen worden opgeslagen als jsonb array in Postgres. Cast als string[] in route handlers.
Numeric als string — Drizzle geeft numeric velden (prijzen) terug als strings. Gebruik parseFloat(String(value)) in de frontend.
Product
Publieke website (Nederlands):

Home — Hero met OranjeSMP logo, server IP kopiëren, Discord link, ranks preview, laatste nieuws
Ranks — Alle 6 ranks (Iron t/m Netherite) met prijzen en voordelen
Shop — Producten kopen via Tikkie/Wero/Creditcard
Nieuws — Artikelen met categorieën en detailpagina's
Over Ons — Team pagina
Contact — Contactformulier
Admin Panel (/admin):

Login met gebruikersnaam + wachtwoord (sessie-based)
Dashboard met statistieken
CRUD voor Ranks, Nieuws, Shop producten, Team, Betalingsmethoden
Site-instellingen (server IP, seizoen, Discord URL, hero tekst)
Gebruikersbeheer
User preferences
Server IP: oranjesmp.nl
Huidig seizoen: Seizoen 3
Discord: https://discord.gg/h8SKf34aB
Admin gebruikers: Xavier, Dylano, Harm, ItzEneaTG
Admin wachtwoord: OranjeXavier (voor alle gebruikers)
Branding: donker gaming thema, oranje (#F97316) als primaire kleur
Taal: volledig Nederlands
Gotchas
Codegen na API wijzigingen — Na elke wijziging in openapi.yaml, run pnpm --filter @workspace/api-spec run codegen voordat je de frontend aanpast.
DB push na schema wijzigingen — Na elke wijziging in lib/db/src/schema/, run pnpm --filter @workspace/db run push.
Admin routes volgorde — Specifieke routes (bijv. /news/all) moeten vóór parameter routes (/news/:id) staan.
CORS credentials — De API heeft credentials: true nodig in CORS en de frontend gebruikt withCredentials via de custom fetch client.
@assets alias — Vite alias @assets wijst naar attached_assets/. Gebruik import logo from "@assets/image_xxx.png" nooit een directe URL.
Pointers
Zie de pnpm-workspace skill voor workspace structuur, TypeScript setup en package details
Admin panel: /admin/login
API gezondheidscheck: /api/healthz
