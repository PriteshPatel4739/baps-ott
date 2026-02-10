import { NextResponse } from "next/server";

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "";

const buildUpstreamUrl = (requestUrl: string) => {
  const { pathname, searchParams } = new URL(requestUrl);
  const baseUrl = getBaseUrl();
  const upstreamPath = pathname.replace("/api/proxy/", "");
  const query = searchParams.toString();
  return `${baseUrl}/${upstreamPath}${query ? `?${query}` : ""}`;
};

const proxyRequest = async (request: Request) => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { error: "API base URL is not configured." },
      { status: 500 }
    );
  }

  const upstreamUrl = buildUpstreamUrl(request.url);
  const authHeader = request.headers.get("authorization") || undefined;
  const contentType = request.headers.get("content-type") || undefined;

  const init: RequestInit = {
    method: request.method,
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
      ...(contentType ? { "content-type": contentType } : {}),
    },
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstreamResponse = await fetch(upstreamUrl, init);
  const data = await upstreamResponse.text();

  return new NextResponse(data, {
    status: upstreamResponse.status,
    headers: {
      "content-type":
        upstreamResponse.headers.get("content-type") || "application/json",
    },
  });
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
