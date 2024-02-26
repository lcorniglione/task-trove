import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { columns } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const columnRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      /* await new Promise((resolve, reject) =>
        setTimeout(() => resolve("done"), 10000),
      ); */
      await ctx.db.insert(columns).values(input);
      revalidatePath(`project/${input.projectId}`);
    }),
});
