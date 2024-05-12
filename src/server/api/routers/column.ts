import { columnCreationSchema } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { columns } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const columnRouter = createTRPCRouter({
  getByProjectId: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input: { projectId } }) => {
      const projectColumns = await ctx.db.query.columns.findMany({
        where: eq(columns.projectId, parseInt(projectId)),
        with: { tasks: true },
      });

      return projectColumns;
    }),
  create: publicProcedure
    .input(columnCreationSchema)
    .mutation(async ({ ctx, input }) => {
      const insertedObj = await ctx.db
        .insert(columns)
        .values(input)
        .returning();

      return insertedObj;
    }),
});
