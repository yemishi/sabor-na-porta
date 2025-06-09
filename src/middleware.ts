import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const isAuth = !!token;
  const isAdmin = token?.isAdmin;

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && (!isAuth || !isAdmin)) {
    const url = req.nextUrl.clone();
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
