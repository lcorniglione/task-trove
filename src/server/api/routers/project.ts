import { projectFormSchema, projectUpdateFormSchema } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { projects } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.projects.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  update: publicProcedure
    .input(projectUpdateFormSchema)
    .mutation(async ({ ctx, input: { projectId, ...rest } }) => {
      return ctx.db
        .update(projects)
        .set(rest)
        .where(eq(projects.id, parseInt(projectId)));
    }),

  geyById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      return ctx.db.query.projects.findFirst({
        where: eq(projects.id, parseInt(id)),
        with: { columns: { with: { tasks: true } } },
      });
    }),

  create: publicProcedure
    .input(projectFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(projects)
        .values(input)
        .returning({ insertedId: projects.id });
    }),
});
