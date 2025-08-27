import { ServerResponse } from "http";

export function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content/Type": "application/json" });
  res.end(JSON.stringify(data)
}
