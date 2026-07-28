/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  BUCKET: R2Bucket;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/portfolio-assets" && request.method === "PUT") {
      const key = url.searchParams.get("key");
      if (!key || key.includes("..") || key.startsWith("/")) {
        return new Response("Invalid asset key", { status: 400 });
      }
      await env.BUCKET.put(key, request.body, {
        httpMetadata: {
          contentType: request.headers.get("content-type") || "application/octet-stream",
          contentDisposition: request.headers.get("x-content-disposition") || undefined,
        },
      });
      return Response.json({ ok: true, key });
    }

    if (url.pathname.startsWith("/downloads/") && request.method === "GET") {
      const key = decodeURIComponent(url.pathname.slice(1));
      const rangeHeader = request.headers.get("range");
      const rangeMatch = rangeHeader?.match(/^bytes=(\d+)-(\d*)$/);
      const range = rangeMatch
        ? { offset: Number(rangeMatch[1]), length: rangeMatch[2] ? Number(rangeMatch[2]) - Number(rangeMatch[1]) + 1 : undefined }
        : undefined;
      const object = await env.BUCKET.get(key, range ? { range } : undefined);
      if (!object) return new Response("Asset not found", { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("accept-ranges", "bytes");
      headers.set("cache-control", key.includes("/media/") ? "public, max-age=31536000, immutable" : "private, max-age=3600");
      if (range && "range" in object && object.range) {
        const offset = "offset" in object.range ? object.range.offset : 0;
        const length = "length" in object.range ? object.range.length : object.size;
        headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
        headers.set("content-length", String(length));
        return new Response(object.body, { status: 206, headers });
      }
      headers.set("content-length", String(object.size));
      return new Response(object.body, { headers });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
