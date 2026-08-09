declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
  };
}

type Fetcher = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

interface D1Database {
  readonly __brand?: "D1Database";
}
