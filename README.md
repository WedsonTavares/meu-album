# Dr. TIS – Álbum de Fotos (React + Node)

Aplicação full-stack organizada em pastas isoladas (`frontend` e `backend`) com autenticação, CRUD de álbuns, upload de fotos com detecção de cor predominante e UI minimalista na paleta da Dr. TIS. Login disponível via e-mail/senha e Google.

## Stack
- **Frontend:** React + Vite + TypeScript, React Router 7, React Query, React Hook Form + Zod, framer-motion, lucide-react.
- **Backend:** Node + Express + TypeScript, Prisma + SQLite, Multer para uploads, JWT para autenticação, exifr + sharp para metadados/cor, Google OAuth (Identity Services).
- **Padrões:** componentes reutilizáveis, CSS com variáveis de tema, validação nos dois lados, rotas protegidas.

## Como rodar
1) Backend
```bash
cd backend
cp .env.example .env   # ajuste JWT_SECRET e GOOGLE_CLIENT_ID (obrigatório p/ Google)
npm install
npm run prisma:push    # cria o dev.db com o schema
npm run dev            # http://localhost:4000
```
Uploads locais ficam em `backend/uploads` e são servidos em `/uploads`. O banco SQLite fica em `backend/prisma/dev.db`.

2) Frontend
```bash
cd frontend
cp .env.example .env   # aponte VITE_API_URL e VITE_GOOGLE_CLIENT_ID
npm install
npm run dev            # http://localhost:5173
```

## Funcionalidades
- Registro/Login com e-mail e senha (JWT) + Login com Google (Identity Services).
- Listagem de álbuns com capa, criação/edição, exclusão bloqueada se houver fotos.
- Detalhe do álbum com troca de visualização (tabela ou miniaturas), preview ampliado, exclusão de foto.
- Upload de fotos (várias de uma vez), captura de metadados EXIF para data e detecção automática de cor predominante.
- UI responsiva com painéis discretos, animações suaves e tipografia customizada.

## Estrutura
- `backend/src`: server, rotas (`/api/auth`, `/api/albums`, `/api/photos`), middlewares, utilitários e config.
- `backend/prisma/schema.prisma`: modelos User, Album, Photo.
- `frontend/src`: páginas (`AuthPage`, `AlbumListPage`, `AlbumDetailPage`), componentes reutilizáveis (botões, modais, cards) e estilos globais.

## Notas rápidas
- Altere `CLIENT_URL` no `.env` do backend se mudar a porta do frontend.
- Para limpar/recriar o banco local, apague `backend/prisma/dev.db` e rode `npm run prisma:push` novamente.
- Token e usuário são persistidos em `localStorage` (`dtrtis_token`, `dtrtis_user`).
