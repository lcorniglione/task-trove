import { db } from "@/server/db";
import { sql } from "drizzle-orm";

// Endpoint to execute in a cron job to keep the database alive (under low traffic circumstances)
export async function GET() {
  let dbHealth;

  try {
    const [res] = await db.execute<{ healthy: boolean }>(
      sql`SELECT true as healthy`,
    );
    dbHealth = res?.healthy;
  } catch (err) {
    dbHealth = false;
  }

  return Response.json(
    {
      db: dbHealth,
    },
    { status: dbHealth ? 200 : 503 },
  );
}
