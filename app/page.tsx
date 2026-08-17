import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirige instantanément le visiteur vers votre vraie page d'accueil /shop
  redirect("/shop");
}
