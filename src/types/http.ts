import type { IncomingMessage, ServerResponse } from "http";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void | Promise<void>;

export interface Route {
  method: HttpMethod;
  path: string;
  handler: Handler;
}

export type AddRoute = (method: HttpMethod, path: string, handler: Handler) => void;
