import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      await jwtVerify(token, encodedKey);
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
