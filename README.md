# Transnet Platform

Monorepo para o novo site institucional e catalogo digital da Transnet.

## Stack desta etapa

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Docker Compose
- Next.js
- Tailwind CSS
- React Hook Form
- Zod

O frontend publico foi implementado em `apps/web`. O painel administrativo ainda fica para uma etapa seguinte.

## Estrutura

```txt
transnet-platform/
  apps/
    api/
    web/
  packages/
    shared/
  docker-compose.yml
```

## Preparacao

```powershell
cd C:\Users\Gabriel\Desktop\Transnet\transnet-platform
copy .env.example apps\api\.env
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev:api
```

O Docker Desktop precisa estar rodando antes de `docker compose up -d`.

Para rodar o frontend:

```powershell
npm run dev -w @transnet/web
```

Frontend:

```txt
http://localhost:3000
```

A API sobe em:

```txt
http://localhost:3333/api
```

## Variaveis de ambiente

Arquivo: `apps/api/.env`

```env
DATABASE_URL="postgresql://transnet:transnet@localhost:5433/transnet?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
PORT=3333
ADMIN_EMAIL="admin@transnet.local"
ADMIN_PASSWORD="Admin123!"
```

## Credenciais seed

```txt
email: admin@transnet.local
senha: Admin123!
```

Altere `ADMIN_EMAIL` e `ADMIN_PASSWORD` antes de rodar seed em ambiente real.

## Scripts

```powershell
npm run dev:api
npm run build:api
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Endpoints principais

Autenticacao:

```txt
POST /api/auth/login
GET  /api/auth/me
```

Categorias:

```txt
GET    /api/categories
GET    /api/categories/tree
GET    /api/categories/:slug
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

Marcas:

```txt
GET    /api/brands
GET    /api/brands/:slug
POST   /api/brands
PATCH  /api/brands/:id
DELETE /api/brands/:id
```

Produtos:

```txt
GET    /api/products
GET    /api/products/featured
GET    /api/products/:slug
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/images
DELETE /api/products/:id/images/:imageId
```

Usuarios administrativos:

```txt
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

Rotas de escrita exigem `Authorization: Bearer <token>`.

## Frontend publico

Rotas implementadas:

```txt
/
/categorias/[slug]
/produtos/[slug]
/cotacao
/contato
/institucional
/marcas
/marcas/[slug]
/politica-de-privacidade
```

Componentes principais:

- `Header`
- `Footer`
- `ProductCard`
- `CategoryCard`
- `BrandList`
- `QuoteButton`
- `Input`
- `Select`
- `Textarea`
- `Button`
- `Loading`
- `EmptyState`

Services e hooks:

- `catalogService`
- `quoteService`
- `contactService`
- `newsletterService`
- `useProducts`
- `useCategories`
- `useQuote`

## Painel administrativo

Rotas implementadas:

```txt
/admin/login
/admin
/admin/produtos
/admin/categorias
/admin/marcas
/admin/cotacoes
/admin/cotacoes/[id]
/admin/contatos
/admin/newsletter
```

O painel usa JWT salvo no `localStorage` do navegador e envia o token nas chamadas protegidas com `Authorization: Bearer <token>`.

Fluxo inicial:

1. Suba banco e API.
2. Rode migration e seed.
3. Acesse `http://localhost:3000/admin/login`.
4. Use as credenciais do seed ou as variaveis configuradas em `.env`.

## Exemplo de login

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3333/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"admin@transnet.local","password":"Admin123!"}'
```

## Arquitetura backend

Cada modulo segue:

- `controller`: entrada HTTP e respostas.
- `service`: regras de negocio e validacoes de existencia.
- `repository`: acesso ao banco via Prisma.
- `dto`: validacao de entrada.

Modulos implementados:

- `auth`
- `users`
- `categories`
- `brands`
- `products`

Tambem foram criados:

- filtro global de erros;
- guard JWT;
- decorator de usuario autenticado;
- Prisma module/service;
- schema e migration inicial;
- seed inicial.
