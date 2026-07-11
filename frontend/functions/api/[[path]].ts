export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  const ZO_BACKEND = "https://earnstack-app-lupeys.zocomputer.io";

  const backendUrl = `${ZO_BACKEND}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-For", request.headers.get("CF-Connecting-IP") || "");
  headers.set("X-Forwarded-Host", url.host);
  headers.delete("host");

  const backendReq = new Request(backendUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().arrayBuffer() : null,
  });

  let resp = await fetch(backendReq);

  const body = await resp.clone().text();
  if (body.includes("The Zo Computer hosting this site is asleep")) {
    await new Promise((r) => setTimeout(r, 8000));
    resp = await fetch(backendReq);
  }

  const responseHeaders = new Headers(resp.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new Response(resp.body, {
    status: resp.status,
    headers: responseHeaders,
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
