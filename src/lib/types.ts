import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
});

export const columnFormSchema = z.object({
  columnName: z.string().min(2).max(50),
});

export const columnCreationSchema = columnFormSchema.extend({
  projectId: z.number(),
});

export const taskFormSchema = z.object({
  name: z.string().min(2).max(50),
});

export const taskCreationSchema = taskFormSchema.extend({
  columnId: z.number(),
});
