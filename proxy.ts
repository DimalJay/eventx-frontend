import { NextRequest, NextResponse } from "next/server";

const publicPages = ["/", "/event", "/terms", "/privacy", "/login", "/register"];
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const hasToken = !!token;
  console.log(request.url);
  const pathname = request.nextUrl.pathname;
  const isAuthpage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const publicPage = publicPages.includes(pathname);

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
