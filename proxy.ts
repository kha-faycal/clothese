import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 🚀 Nouvelle norme Next.js 16 : La fonction doit obligatoirement s'appeler "proxy"
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lecture du token JWT sécurisé de NextAuth (s'exécute sur le Runtime Node.js stable)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protection stricte : Redirection si l'accès à /dashboard n'est pas authentifié
  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/shop/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Filtre d'exécution ciblé uniquement sur le tableau de bord
export const config = {
  matcher: ["/dashboard/:path*"],
};
