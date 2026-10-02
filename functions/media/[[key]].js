/** Serves images that were uploaded into demos (R2 bucket MEDIA). Keys are random, so the files are public but unguessable. */
export async function onRequestGet({ env, params, request }) {
  const key = Array.isArray(params.key) ? params.key.join("/") : params.key;
  if (!/^[a-f0-9]{24}\.[a-z0-9]{2,5}$/.test(key ?? "")) return new Response("Not found", { status: 404 });
  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  if (request.headers.get("If-None-Match") === object.httpEtag) return new Response(null, { status: 304 });
  const headers = new Headers({
    "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: object.httpEtag,
    "X-Content-Type-Options": "nosniff",
    // an SVG opened on its own must not be able to run scripts on this origin
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  });
  return new Response(object.body, { headers });
}
