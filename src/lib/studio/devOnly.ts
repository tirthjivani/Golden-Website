// The studio (UI + API) is a local authoring tool only. It must never be
// reachable on a deployed/production build. NODE_ENV is "production" for
// `next build`/`next start` and on Vercel; "development" for `next dev`.
export const STUDIO_ENABLED = process.env.NODE_ENV !== "production";

export function studioForbiddenResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Studio is disabled outside local development." }),
    { status: 403, headers: { "content-type": "application/json" } },
  );
}
