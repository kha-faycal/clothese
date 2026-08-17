import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    // ✅ Prisma v7 lit la chaîne de connexion uniquement depuis ce bloc central
    url: process.env.DATABASE_URL,
  },
});
