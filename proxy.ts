import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protection stricte : on n'exécute la vérification que pour le dashboard
  if (pathname.startsWith("/dashboard")) {
    
    // Récupération du token en transmettant explicitement le secret et le nom du cookie sécurisé
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      // 🔒 Force getToken à chercher à la fois le cookie local et le cookie sécurisé de production
      secureCookie: process.env.NODE_ENV === "production",
    });

    // Si aucun token valide n'est trouvé, redirection vers la page de connexion
    if (!token) {
      const loginUrl = new URL("/shop/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Intercepte uniquement la route /dashboard et ses sous-pages
  matcher: ["/dashboard", "/dashboard/:path*"],
};
