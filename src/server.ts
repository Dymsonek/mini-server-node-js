import * as http from "node:http";
import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { parseBody } from "./utils/parseBody";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";
type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void | Promise<void>;

interface Route {
  method: HttpMethod;
  path: string;
  handler: Handler;
}

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
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ parsed: body }));
});

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
