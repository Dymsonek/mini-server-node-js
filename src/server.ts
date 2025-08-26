import http, { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

const hostname = "127.0.0.1";
const port = 3000;

const routes: Route[] = [];

const addRoute = (method: string, path: string, handler: Handler) => {
  routes.push({ method, path, handler });
};
const matchRoute = (method: string, url: url): Route | undefined => {
  const { pathname } = new URL(url, "http://localhost");
  routes.find((r) => r.method === method && r.path === pathname);
};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-type", "text/plain; charset=utf-8");
  res.end("Hello, World!\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
