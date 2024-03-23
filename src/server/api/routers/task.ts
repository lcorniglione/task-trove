import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tasks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  getByColumnId: publicProcedure
    .input(z.object({ columnId: z.number() }))
    .query(async ({ ctx, input }) => {
      const columnTasks = await ctx.db.query.tasks.findMany({
        where: eq(tasks.columnId, input.columnId),
      });

      return columnTasks;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(tasks).where(eq(tasks.id, input.id));
    }),
});
