"use client";

import { type Task } from "@/server/db/types";
import { api } from "@/trpc/react";
import { Button } from "@/ui/button";
import { TypographyPSmall } from "@/ui/typography";
import { Trash } from "lucide-react";

const ColumnTask = ({ task }: { task: Task }) => {
  const ctx = api.useUtils();
  const { mutate: deleteTask } = api.task.delete.useMutation({
    onMutate: async () => {
      // Should never happen
      if (!task.columnId) return;

      await ctx.task.getByColumnId.cancel({ columnId: task.columnId });

      const prevData = ctx.task.getByColumnId.getData({
        columnId: task.columnId,
      });

      if (!prevData) return { prevData };

      const taskIndex = prevData.findIndex((t) => t.id === task.id);

      if (taskIndex === -1) return { prevData };

      prevData?.splice(taskIndex, 1);

      ctx.task.getByColumnId.setData({ columnId: task.columnId }, () => [
        ...prevData,
      ]);

      return { prevData };
    },
    onSettled() {
      // Should never happen
      if (!task.columnId) return;

      void ctx.task.getByColumnId.invalidate({ columnId: task.columnId });
    },
  });

  const handleTaskDeletion = () => {
    deleteTask({ id: task.id });
  };

  return (
    <li
      key={task.id}
      className="flex w-full items-center justify-between rounded-lg bg-[#22272B] px-3 py-2 dark:bg-white dark:shadow-task-shadow"
    >
      <TypographyPSmall>{task.name}</TypographyPSmall>

      <Button variant="ghost" size="icon" onClick={handleTaskDeletion}>
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </li>
  );
};

export default ColumnTask;
