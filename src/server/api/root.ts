import { columnRouter } from "@/server/api/routers/column";
import { projectRouter } from "@/server/api/routers/project";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  column: columnRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
