export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.exyuiptv.app") {
      url.hostname = "exyuiptv.app";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "");
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    const contentType = headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    } else if (
      contentType.includes("image/") ||
      contentType.includes("font/") ||
      url.pathname.includes("/_astro/") ||
      url.pathname.includes("/images/")
    ) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      headers.set("Cache-Control", "public, max-age=86400");
    }

    headers.set("Vary", "Accept-Encoding");
    headers.set("X-Edge-Worker", "on");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
