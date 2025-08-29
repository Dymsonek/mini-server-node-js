# mini-server-node-js

Minimal Node.js HTTP server in TypeScript using native `node:http`.

## Scripts
- `npm run dev`: Run in watch mode with `tsx` (develop from `src/server.ts`).
- `npm run build`: Compile TypeScript to `dist/`.
- `npm start`: Run compiled server `dist/server.js`.

## Getting Started
1. Install deps: `npm install`
2. Dev mode: `npm run dev`
3. Build: `npm run build`
4. Start: `npm start`

Server listens on `http://127.0.0.1:3000`.

## Endpoints
- `GET /` → Plain text welcome message.
- `POST /echo` → Echoes JSON body as `{ parsed: <body> }`.
- `GET /health` → `{ status: "ok" }`.
- `GET /users` → Example list of users.
