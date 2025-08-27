import { IncomingMessage } from "http";

export async function parseBody<T = any>(
  req: IncomingMessage,
): Promise<T | null> {
  const contentType = req.headers["content-type"];
  if (!contentType?.startsWith("application/json")) {
    return null;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const body = Buffer.concat(chunks).toString("utf8");

  try {
    return JSON.parse(body) as T;
  } catch (error) {
    console.warn("Failed to parse JSON body:", error);
    return null;
  }
}
