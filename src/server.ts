import * as http from "node:http";
import { IncomingMessage } from "node:http";
import { URL } from "node:url";
import { parseBody } from "./utils/parseBody";
import { sendJson } from "./utils/sendJson";
import { sendError } from "./utils/sendError";
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
): { route: Route | undefined; pathname: string } => {
  const u = typeof url === "string" ? new URL(url, "http://localhost") : url;
  const { pathname } = u;
  const route = routes.find((r) => r.method === method && r.path === pathname);
  return { route, pathname };
};

const parseQuery = (u: URL) => {
  const q: Record<string, string | string[]> = {};
  for (const key of u.searchParams.keys()) {
    const vals = u.searchParams.getAll(key);
    q[key] = vals.length > 1 ? vals : (vals[0] ?? "");
  }
  return q;
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
  const rawUrl = req.url ?? "/";
  const url = new URL(rawUrl, "http://localhost");

  req.query = parseQuery(url);

  const { route, pathname } = matchRoute(method, url);

  if (method === "OPTIONS") {
    const allowed = routes
      .filter((r) => r.path === pathname)
      .map((r) => r.method);
    const allowHeader = Array.from(new Set([...allowed, "OPTIONS"])).join(", ");
    const acrh =
      (req.headers["access-control-request-headers"] as string) || "*";

    res.writeHead(204, {
      Allow: allowHeader,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": allowHeader || "*",
      "Access-Control-Allow-Headers": acrh,
      "Access-Control-Max-Age": "600",
    });
    res.end();
    return;
  }

  if (route) {
    try {
      await route.handler(req, res);
    } catch (err) {
      console.error("Unhandled route error:", err);
      sendError(res, 500, "InternalServerError");
    }
    return;
  }

  const methodsForPath = routes
    .filter((r) => r.path === pathname)
    .map((r) => r.method);
  if (methodsForPath.length > 0) {
    const allowHeader = Array.from(
      new Set([...methodsForPath, "OPTIONS"]),
    ).join(", ");
    if (!res.headersSent && !res.writableEnded) {
      res.writeHead(405, {
        "Content-Type": "application/json",
        Allow: allowHeader,
      });
      res.end(
        JSON.stringify({
          error: { code: "MethodNotAllowed", message: "Method Not Allowed" },
        }),
      );
    }
    return;
  }

  if (!res.headersSent && !res.writableEnded) {
    sendError(res, 404, "NotFound");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
