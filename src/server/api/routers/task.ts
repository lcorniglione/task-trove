import { taskCreationSchema, taskUpdateSchema } from "@/lib/types";
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
        orderBy: tasks.positionInsideColumn,
      });

      return columnTasks;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(tasks).where(eq(tasks.id, input.id));
    }),
  create: publicProcedure
    .input(taskCreationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(tasks).values(input);
    }),
  update: publicProcedure
    .input(taskUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(tasks)
        .set(input)
        .where(eq(tasks.id, input.id));
    }),
});
