import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

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
  method: string;
  path: string;
  handler: Handler;
}

const hostname = "127.0.0.1";
const port = 3000;

const routes: Route[] = [];

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

addRoute("GET", "/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Welcome to Home Page");
});

addRoute("POST", "/echo", async (req, res) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(JSON.stringify({ youSent: body }));
});

const server = http.createServer((req, res) => {
  const route = req.url ? matchRoute(req.method || "GET", req.url) : undefined;
  if (route) {
    route.handler(req, res);
  }
  res.writeHead(404, { "Content-type": "text/plain" });
  res.end("Not Found");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
