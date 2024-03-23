"use client";

import ColumnTask from "@/app/_components/column-task";
import { type ColumnWithTasks } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { TypographySmall } from "@/ui/typography";
import { Plus } from "lucide-react";

const Column = ({ column }: { column: ColumnWithTasks }) => {
  const { data: tasks } = api.task.getByColumnId.useQuery(
    {
      columnId: column.id,
    },
    { initialData: column.tasks },
  );

  return (
    <li className="flex h-[100vh] min-w-[350px] flex-col ">
      <div className="w-full rounded-lg bg-black text-white shadow-2xl dark:bg-[#f1f2f4] dark:text-black">
        <section className="p-2">
          <TypographySmall>{column.name}</TypographySmall>
        </section>

        <ol className="p-2">
          {tasks.map((task) => (
            <ColumnTask key={task.id} task={task} />
          ))}
        </ol>

        <section className="p-2">
          <Button variant="ghost">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </section>
      </div>
    </li>
  );
};

export default Column;
