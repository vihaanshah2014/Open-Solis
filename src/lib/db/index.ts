import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined");
// }

const sql = neon('postgresql://neondb_owner:eMokN14JhqGw@ep-dark-hall-a54scvg9.us-east-2.aws.neon.tech/neondb?sslmode=require');

export const db = drizzle(sql);
