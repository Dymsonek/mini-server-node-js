import * as http from "node:http";
import { IncomingMessage } from "node:http";
import { URL } from "node:url";
import { parseBody } from "./utils/parseBody";
import { sendJson } from "./utils/sendJson";
import type { HttpMethod, Route, Handler } from "./types/http";
import { registerHealthRoutes } from "./routes/health";
import { registerUserRoutes } from "./routes/users";

const hostname = "127.0.0.1";
const port = 3000;

const routes: Route[] = [];

const logger = (req: IncomingMessage) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
};

const addRoute = (method: HttpMethod, path: string, handler: Handler) => {
  routes.push({ method, path, handler });
};

const matchRoute = (
  method: HttpMethod,
  url: string | URL,
): Route | undefined => {
  const u = typeof url === "string" ? new URL(url, "http://localhost") : url;
  const { pathname } = u;
  return routes.find((r) => r.method === method && r.path === pathname);
};

// --- routes ---
addRoute("GET", "/", (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Welcome to Home Page");
});

addRoute("POST", "/echo", async (req, res) => {
  const body = await parseBody(req);
  sendJson(res, 200, { parsed: body });
});

// register modular routes
registerHealthRoutes(addRoute);
registerUserRoutes(addRoute);

// --- server ---
const server = http.createServer(async (req, res) => {
  logger(req);

  const method = (req.method || "GET") as HttpMethod;
  const route = req.url ? matchRoute(method, req.url) : undefined;

  if (route) {
    await route.handler(req, res);
    return;
  }

  if (!res.headersSent && !res.writableEnded) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
