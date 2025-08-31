# mini-server-node-js

Minimal Node.js HTTP server in TypeScript using native `node:http`.

## Features
- Structured errors: Consistent JSON `{ error: { code, message } }`.
- 404/405/OPTIONS: 404 for unknown paths, 405 with `Allow` header, automatic CORS preflight handling.
- Query parsing: Parses `req.url` and exposes `req.query` (string or string[]).

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

## Errors
- Shape: All errors return JSON `{ error: { code, message } }`.
- 404 Not Found: `{"error": {"code": "NotFound", "message": "Not Found"}}`.
- 405 Method Not Allowed: includes `Allow` header with permitted methods.
- 500 Internal Server Error: unhandled handler exceptions are caught and returned as JSON.

## CORS / Preflight
- `OPTIONS` requests return `204 No Content` with:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: <computed methods + OPTIONS>`
  - `Access-Control-Allow-Headers: <requested headers or *>`
  - `Access-Control-Max-Age: 600`
  - `Allow: <computed methods + OPTIONS>`

## Query Parsing
- Incoming requests have `req.query` populated from the URL query string.
- Values are strings or string arrays when multiple values are provided.
