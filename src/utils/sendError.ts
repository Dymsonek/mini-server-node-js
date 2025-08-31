import { ServerResponse } from "http";
import { sendJson } from "./sendJson";

export type ErrorCode =
  | "NotFound"
  | "MethodNotAllowed"
  | "BadRequest"
  | "InternalServerError";

export function sendError(
  res: ServerResponse,
  status: number,
  code: ErrorCode,
  message?: string,
) {
  if (res.headersSent) return;
  sendJson(res, status, {
    error: {
      code,
      message: message ?? defaultMessage(status, code),
    },
  });
}

function defaultMessage(status: number, code: ErrorCode): string {
  if (code === "NotFound" && status === 404) return "Not Found";
  if (code === "MethodNotAllowed" && status === 405)
    return "Method Not Allowed";
  if (code === "BadRequest" && status === 400) return "Bad Request";
  return "Internal Server Error";
}
