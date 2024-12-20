import * as LucideIcons from "lucide-react";
import { z } from "zod";

export const projectNameFormSchema = z.object({
  name: z.string().min(2).max(50),
});

export const projectFormSchema = projectNameFormSchema.extend({
  description: z.string().optional(),
  icon: z
    .string()
    .optional()
    .refine(
      (value) => {
        const icon = LucideIcons.icons[value as keyof typeof LucideIcons.icons];
        return !!icon;
      },
      {
        message: "Invalid icon",
      },
    ),
});

export const projectUpdateFormSchema = projectFormSchema.extend({
  projectId: z.string(),
});

export const columnFormSchema = z.object({
  name: z.string().min(2).max(50),
});

export const columnCreationSchema = columnFormSchema.extend({
  projectId: z.number(),
});

export const taskFormSchema = z.object({
  name: z.string().min(2).max(50),
});

export const taskCreationSchema = taskFormSchema.extend({
  columnId: z.number(),
  positionInsideColumn: z.number(),
});

export const taskUpdateSchema = z.object({
  id: z.number(),
  positionInsideColumn: z.number().optional(),
  columnId: z.number().optional(),
  prevColumnId: z.number().optional(),
});
