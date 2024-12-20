// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `task-trove_${name}`);

export const projects = createTable(
  "project",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    icon: varchar("icon", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (example) => ({
    nameIndex: index("project_name_idx").on(example.name),
  }),
);

export const projectsRelations = relations(projects, ({ many }) => ({
  columns: many(columns),
}));

export const columns = createTable(
  "column",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    projectId: integer("project_id"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (example) => ({
    nameIndex: index("column_name_idx").on(example.name),
  }),
);

export const columnsRelations = relations(columns, ({ one, many }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),

  tasks: many(tasks),
}));

export const tasks = createTable(
  "task",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    author: varchar("author", { length: 256 }).notNull().default("me"), // In the future it's gonna be user
    positionInsideColumn: doublePrecision("positionInsideColumn").notNull(),
    columnId: integer("column_id").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (example) => ({
    nameIndex: index("task_name_idx").on(example.name),
  }),
);

export const tasksRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
}));
