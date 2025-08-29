import type { AddRoute } from "../types/http";
import { sendJson } from "../utils/sendJson";

export function registerHealthRoutes(addRoute: AddRoute) {
  addRoute("GET", "/health", (_req, res) => {
    sendJson(res, 200, { status: "ok" });
  });
}
