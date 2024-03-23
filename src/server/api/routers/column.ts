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
    .input(
      z.object({
        name: z.string(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const columnTable = await ctx.db.insert(columns).values(input);

      return columnTable.insertId;
    }),
});
