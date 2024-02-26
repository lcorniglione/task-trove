import { type columns, type tasks } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export type Task = InferSelectModel<typeof tasks>;
export type ColumnWithTasks = InferSelectModel<typeof columns> & {
  tasks: Task[];
};
