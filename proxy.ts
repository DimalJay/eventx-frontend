import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
 const token = request.headers.get("cookie")?.split(";").find(cookie => cookie.trim().startsWith("auth_token="))?.split("=")[1];
  const hasToken = !!token;
  console.log(request.url);
  const pathname = request.nextUrl.pathname;
  const isAuthpage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const publicPage = pathname === '/' || pathname.startsWith("/event");

  if(hasToken && isAuthpage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }else if(!hasToken && !isAuthpage && !publicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|login|register).*)',
  ],
};
