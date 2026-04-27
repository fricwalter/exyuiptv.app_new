export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const originalUrl = url.toString();
    let redirectPath = url.pathname.replace(/\/{2,}/g, "/");

    if (url.hostname === "www.exyuiptv.app") {
      url.hostname = "exyuiptv.app";
    }

    if (
      redirectPath === "/blog/ex-yu-utakmice-uzivo-dijaspora-2026" ||
      redirectPath === "/blog/ex-yu-utakmice-uzivo-dijaspora-2026/"
    ) {
      redirectPath = "/blog/ex-yu-iptv-utakmice-uzivo-dijaspora-2026/";
    }

    if (redirectPath === "/images/blog/apple-tv-ex-yu-iptv-2026-podesavanje/.webp") {
      redirectPath = "/images/blog/apple-tv-ex-yu-iptv-2026-podesavanje.webp";
    }

    const hasExtension = /\.[^/]+$/.test(redirectPath);

    if (redirectPath !== "/" && !hasExtension && !redirectPath.endsWith("/")) {
      redirectPath = `${redirectPath}/`;
    }

    if (hasExtension && redirectPath.length > 1 && redirectPath.endsWith("/")) {
      redirectPath = redirectPath.replace(/\/+$/, "");
    }

    if (redirectPath !== url.pathname) {
      url.pathname = redirectPath;
    }

    if (url.toString() !== originalUrl) {
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(new Request(url.toString(), request));
    const headers = new Headers(response.headers);
    const contentType = headers.get("content-type") || "";
    const isHomePage = url.pathname === "/";

    if (contentType.includes("text/html")) {
      if (isHomePage) {
        headers.set("Cache-Control", "no-store, max-age=0");
      } else {
        headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
      }
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

    if (isHomePage && contentType.includes("text/html")) {
      let html = await response.text();
      const tag = '<meta name="yandex-verification" content="f9a64c607c5f7f54" />';

      if (!html.includes('name="yandex-verification"')) {
        html = html.replace("<head>", `<head>${tag}`);
      }

      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
