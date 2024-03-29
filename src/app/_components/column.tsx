"use client";

import ColumnTask from "@/app/_components/column-task";
import EmptyTask from "@/app/_components/empty-task";
import { type ColumnWithTasks } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { TypographySmall } from "@/ui/typography";
import { useClickAway } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

const Column = ({ column }: { column: ColumnWithTasks }) => {
  const [addingTask, setAddingTask] = useState(false);
  const { data: tasks } = api.task.getByColumnId.useQuery(
    {
      columnId: column.id,
    },
    { initialData: column.tasks },
  );

  const listRef = useRef(null);
  const ref = useClickAway<HTMLLIElement>(() => {
    setAddingTask(false);
  });

  return (
    <li className="flex h-full min-w-[350px] flex-col">
      <div className="flex max-h-full w-full flex-col rounded-lg bg-black text-white shadow-2xl dark:bg-[#f1f2f4] dark:text-black">
        <section className="p-2">
          <TypographySmall>{column.name}</TypographySmall>
        </section>

        <ol className="flex flex-col gap-2 overflow-y-auto p-2" ref={listRef}>
          {tasks.map((task) => (
            <ColumnTask key={task.id} task={task} />
          ))}
        </ol>

        {!addingTask ? (
          <section className="flex justify-between p-2">
            <Button variant="ghost" onClick={() => setAddingTask(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </section>
        ) : (
          <EmptyTask
            ref={ref}
            listRef={listRef}
            onCancel={() => setAddingTask(false)}
            columnId={column.id}
          />
        )}
      </div>
    </li>
  );
};

export default Column;
