import type { AddRoute } from "../types/http";
import { sendJson } from "../utils/sendJson";

const users = [
  { id: 1, name: "Ada Lovelace" },
  { id: 2, name: "Alan Turing" },
];

export function registerUserRoutes(addRoute: AddRoute) {
  addRoute("GET", "/users", (_req, res) => {
    sendJson(res, 200, { users });
  });
}
