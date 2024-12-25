"use client";

import ColumnTask from "@/app/_components/column-task";
import EmptyTask from "@/app/_components/empty-task";
import { taskUpdateSchema } from "@/lib/types";
import { type ColumnWithTasks } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { TypographySmall } from "@/ui/typography";
import { useClickAway } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import type { DragEvent } from "react";
import { useRef, useState } from "react";
import z from "zod";

const optimisticColumnMutation = async (
  ctx: ReturnType<typeof api.useUtils>,
  modifiedTask: z.infer<typeof taskUpdateSchema>,
  columnId: number,
) => {
  if (!modifiedTask.prevColumnId) return;

  await ctx.task.getByColumnId.cancel({ columnId: columnId });

  const prevDataOnPrevColumn = ctx.task.getByColumnId.getData({
    columnId: modifiedTask.prevColumnId,
  });

  if (!prevDataOnPrevColumn) return { prevDataOnPrevColumn };

  const prevDataOnNewColumn = ctx.task.getByColumnId.getData({
    columnId: columnId,
  });

  if (!prevDataOnNewColumn) {
    return { prevDataOnPrevColumn, prevDataOnNewColumn };
  }

  const taskIndex = prevDataOnPrevColumn.findIndex(
    (t) => t.id === modifiedTask.id,
  );

  const prevTask = prevDataOnPrevColumn[taskIndex];
  if (!prevTask) return { prevDataOnNewColumn, prevDataOnPrevColumn };

  const fullTask = {
    ...prevTask,
    ...modifiedTask,
  };

  const newData = [...prevDataOnPrevColumn];
  newData.splice(taskIndex, 1);
  prevDataOnNewColumn.push(fullTask);

  const prevColumn = newData.sort(
    (t1, t2) => t1.positionInsideColumn - t2.positionInsideColumn,
  );

  const newColumn = prevDataOnNewColumn.sort(
    (t1, t2) => t1.positionInsideColumn - t2.positionInsideColumn,
  );

  ctx.task.getByColumnId.setData(
    { columnId: modifiedTask.prevColumnId },
    () => [...prevColumn],
  );

  ctx.task.getByColumnId.setData({ columnId: columnId }, () => newColumn);

  return { prevDataOnPrevColumn, prevDataOnNewColumn };
};

const Column = ({ column }: { column: ColumnWithTasks }) => {
  const [addingTask, setAddingTask] = useState(false);
  const [acceptDrop, setAcceptDrop] = useState(false);
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

  const ctx = api.useUtils();
  const { mutate: updateTask } = api.task.update.useMutation({
    onMutate: async (modifiedTask) => {
      const resp = await optimisticColumnMutation(ctx, modifiedTask, column.id);

      if (!resp) return;

      return resp;
    },
    onSettled(_, e, variables) {
      void ctx.task.getByColumnId.invalidate({ columnId: column.id });
      void ctx.task.getByColumnId.invalidate({
        columnId: variables.prevColumnId,
      });
    },
  });

  const handleDrop = (ev: DragEvent<HTMLOListElement>) => {
    const data: { taskId: number; columnId: number } = JSON.parse(
      ev.dataTransfer.getData("application/drag"),
    );

    const taskId = data.taskId;
    const columnId = data.columnId;
    if (!taskId) return;

    // If we are moving tasks inside the same column
    if (columnId === column.id) {
      setAcceptDrop(false);
      return;
    }

    updateTask({
      id: taskId,
      columnId: column.id,
      prevColumnId: data.columnId,
    });

    setAcceptDrop(false);
  };

  const handleDragOver = (e: DragEvent<HTMLOListElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setAcceptDrop(true);
  };

  const handleDragLeave = () => {
    setAcceptDrop(false);
  };

  return (
    <li className="flex h-full min-w-[350px] flex-col">
      <div
        className={`flex max-h-full w-full flex-col rounded-lg bg-secondary-foreground text-secondary ${acceptDrop ? "outline outline-2 outline-[#f44250]" : ""}`}
      >
        <section className="p-2">
          <TypographySmall>{column.name}</TypographySmall>
        </section>

        <ol
          className="flex flex-col overflow-y-auto p-2"
          ref={listRef}
          id="target"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
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
