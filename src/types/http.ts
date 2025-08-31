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

// Parsed query representation exposed on req.query
export type ParsedQuery = Record<string, string | string[]>;

declare module "http" {
  // Augment IncomingMessage to carry parsed query data
  interface IncomingMessage {
    query?: import("./http").ParsedQuery;
  }
}
